function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Incoming token:", token ? token.slice(0, 40) + "..." : "None");

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.sendStatus(403);
    }

    req.userId = decoded.userId; 
    next();
  });
}

function normalizeText(str) {
  return str
    .toLowerCase()
    .replace(/iced/g, "ice")
    .replace(/snow/g, "ice")
    .replace(/one/g, "1")
    .replace(/\s+/g, " ")
    .trim();
}

const dotenv = require('dotenv'); 
dotenv.config({ path: __dirname + '/.env' }); 

const JWT_SECRET = process.env.JWT_SECRET || 'CFoJy9csauDWon3fhdTcviGLMZt6afHm'; 

const express = require('express');
const pool = require('./db');

const setupLoyaltyTrigger = async () => {
  await pool.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS loyalty_applied BOOLEAN DEFAULT false;
  `);

  await pool.query(`
    CREATE OR REPLACE FUNCTION apply_loyalty_on_completed_order()
    RETURNS TRIGGER AS $$
    DECLARE
      drink_total INTEGER := 0;
    BEGIN
      IF NEW.status = 'completed'
         AND OLD.status IS DISTINCT FROM 'completed'
         AND NEW.loyalty_applied = false THEN

        SELECT COALESCE(SUM((item->>'quantity')::int), 0)
        INTO drink_total
        FROM jsonb_array_elements(NEW.items) AS item
        WHERE item->>'type' = 'drink'
          AND (item->>'is_free')::boolean = false;

        UPDATE loyalty
        SET drink_count = drink_count + drink_total,
            updated_at = NOW()
        WHERE customer_id = NEW.user_id;

        UPDATE orders
        SET loyalty_applied = true
        WHERE id = NEW.id;
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await pool.query(`
    DROP TRIGGER IF EXISTS trg_apply_loyalty_on_completed_order ON orders;

    CREATE TRIGGER trg_apply_loyalty_on_completed_order
    AFTER UPDATE OF status
    ON orders
    FOR EACH ROW
    EXECUTE FUNCTION apply_loyalty_on_completed_order();
  `);

  console.log("✅ Loyalty trigger ready");
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client('1018371869413-d6k2ancgs59ujstbuu8j6b38lo6foec8.apps.googleusercontent.com');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const crypto = require("crypto");

console.log("Email user:", process.env.EMAIL_USER);
console.log("Email pass exists:", !!process.env.EMAIL_PASS);

const app = express();

app.get("/__ping", (req, res) => {
  res.send("PING OK - PAYMONGO SERVER");
});

app.use(cors());

app.post("/api/paymongo/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const event = req.body;

      if (event?.data?.attributes?.type !== "payment.paid") {
        return res.sendStatus(200);
      }

      const payment = event.data.attributes.data;

      const transactionId = payment.id; // pay_...
      const sourceId = payment.attributes.source.id;

      const result = await pool.query(
        `
        UPDATE orders
        SET transaction_id = $1,
            status = 'completed'
        WHERE source_id = $2
        RETURNING user_id
        `,
        [transactionId, sourceId]
      );

      if (result.rows.length > 0) {
        const userId = result.rows[0].user_id;
        await applyLoyaltyForCompletedOrders(userId);
      }

      console.log("✅ GCash payment confirmed:", {
        transactionId,
        sourceId,
      });

      res.sendStatus(200);
    } catch (err) {
      console.error("❌ Webhook error:", err);
      res.sendStatus(400);
    }
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ PayMongo redirect SUCCESS
app.get("/api/paymongo/redirect/success", (req, res) => {
  console.log("✅ PayMongo redirect SUCCESS hit");

  res.setHeader("Content-Type", "text/html");
  res.send(`
    <html>
      <head>
        <title>Payment Successful</title>
      </head>
      <body>
        <p>Payment successful. Redirecting back to app...</p>
        <script>
          window.location.href = "capstone://payment-success";
        </script>
      </body>
    </html>
  `);
});

// ❌ PayMongo redirect FAILED
app.get("/api/paymongo/redirect/failed", (req, res) => {
  console.log("❌ PayMongo redirect FAILED hit");

  res.setHeader("Content-Type", "text/html");
  res.send(`
    <html>
      <head>
        <title>Payment Failed</title>
      </head>
      <body>
        <p>Payment failed. Returning to app...</p>
        <script>
          window.location.href = "capstone://payment-failed";
        </script>
      </body>
    </html>
  `);
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true = port 465, false = 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_URL = "https://api.paymongo.com/v1";
const PUBLIC_URL = process.env.PUBLIC_URL;

const otpStore = {};

const resolveImageUrl = (imagePath, req) => {
  if (!imagePath) return null;

  // Already absolute URL
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const cleanPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${req.protocol}://${req.headers.host}${cleanPath}`;
};

// Start of Routes

app.post("/api/register", async (req, res) => {
  console.log("Received register body:", req.body);
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO customers (full_name, email, password_hash, email_verified)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, email_verified`,
      [full_name, email, hashedPassword, true]
    );

    const newCustomerId = result.rows[0].id;

    await pool.query(
      `
      INSERT INTO loyalty (customer_id, drink_count, free_drinks)
      VALUES ($1, 0, 0)
      `,
      [newCustomerId]
    ); 

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === "23505") {
      res.status(400).json({ message: "Email already exists." });
    } else {
      res.status(500).json({ message: "Server error during registration." });
    }
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

  try {
    const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials.' });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const otpCode = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `UPDATE customers 
      SET otp_code = $1, otp_expiry = $2 
      WHERE id = $3`,
      [otpCode, expiry, user.id]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Login OTP Code',
      text: `Your OTP code is: ${otpCode}`,
    });

    const otpToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '5m' });
    res.json({ message: 'OTP sent to email.', otp_token: otpToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Google sign-in route
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  const googleClient = new OAuth2Client('1018371869413-p1alpi2lc93rtbem9fdr80bidbebl3bh.apps.googleusercontent.com');

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: '1018371869413-p1alpi2lc93rtbem9fdr80bidbebl3bh.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists or create new
    let user = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      user = await pool.query(
        `INSERT INTO customers (full_name, email, password_hash, email_verified)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [name, email, '', true]
      );

      const newCustomerId = user.rows[0].id;

      await pool.query(
        `
        INSERT INTO loyalty (customer_id, drink_count, free_drinks)
        VALUES ($1, 0, 0)
        `,
        [newCustomerId]
      );
    }

    const sessionToken = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ sessionToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Google token.' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { otp, token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [userId]);
    const user = result.rows[0];

    const expiry = new Date(user.otp_expiry);
    if (user.otp_code !== otp || new Date() > expiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    await pool.query(
      'UPDATE customers SET email_verified = true, otp_code = NULL, otp_token = NULL, otp_expiry = NULL, logged_in_at = NOW() WHERE id = $1',
      [userId]
    );

    const sessionToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    console.log("Session token created for user:", user.id);
    console.log("Token:", sessionToken);

    res.json({ message: 'OTP verified. Login complete.', token: sessionToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

app.post('/api/resend-otp', async (req, res) => {
  const { email } = req.body;  

  try {
    const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = result.rows[0];

    const newOtpCode = generateOTP();
    const newOtpToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '5m' });
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `UPDATE customers 
       SET otp_code = $1, otp_token = $2, otp_expiry = $3 
       WHERE id = $4`,
      [newOtpCode, newOtpToken, newExpiry, user.id]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your New OTP Code',
      text: `Your new OTP code is: ${newOtpCode}`
    });

    res.json({ message: 'New OTP sent.', otp_token: newOtpToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.get('/api/validate-token', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); 
    res.status(200).json({ valid: true, userId: decoded.userId });
  });
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required.' });

  try {
    const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = result.rows[0];

    const passwordOtpCode = generateOTP();
    const passwordOtpToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '5m' });
    const passwordExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `UPDATE customers 
      SET password_otp_code = $1, password_otp_expiry = $2 
      WHERE id = $3`,
      [passwordOtpCode, passwordExpiry, user.id]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP Code',
      text: `Your password reset code is: ${passwordOtpCode}`
    });

    res.json({ message: 'Password reset OTP sent to email.', password_otp_token: passwordOtpToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.post('/api/verify-password-otp', async (req, res) => {
  const { otp, token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = result.rows[0];

    // Compare using Date objects
    const expiry = new Date(user.password_otp_expiry);
    if (user.password_otp_code !== otp || new Date() > expiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    res.json({ message: 'OTP verified. Proceed to reset password.' });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

app.post('/api/resend-password-otp', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [userId]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const user = result.rows[0];

    const newOtpCode = generateOTP();
    const newOtpToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '5m' });
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `UPDATE customers 
       SET password_otp_code = $1, password_otp_token = $2, password_otp_expiry = $3 
       WHERE id = $4`,
      [newOtpCode, newOtpToken, newExpiry, user.id]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your New Password Reset OTP Code',
      text: `Your new password reset OTP code is: ${newOtpCode}`
    });

    res.json({ message: 'New password reset OTP sent.', password_otp_token: newOtpToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please request a new password reset.' });
    }
    return res.status(401).json({ message: 'Invalid token.' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: 'Token and password required.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE customers 
       SET password_hash = $1, password_otp_code = NULL, password_otp_token = NULL, password_otp_expiry = NULL 
       WHERE id = $2`,
      [hashedPassword, userId]
    );

    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

app.post("/api/profile/upload-picture", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    // 1. Multer validation
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    const userId = req.userId;  // FIXED: use req.userId (not req.user.id)
    const filePath = req.file.path;

    const formData = new FormData();
    formData.append("image", fs.createReadStream(filePath));

    // 2. Upload to Laravel
    let uploadResponse;
    try {
      uploadResponse = await axios.post(
        "http://127.0.0.1:8000/api/upload-profile-picture",
        formData,
        { headers: formData.getHeaders() }
      );
    } catch (laravelErr) {
      console.error("Laravel upload FAILED:", laravelErr.response?.data || laravelErr);
      return res.status(500).json({ message: "Laravel image upload failed." });
    }

    // 3. Laravel result
    const data = uploadResponse.data;

    // 4. Remove temp file
    fs.unlinkSync(filePath);

    // 5. Save path to PostgreSQL
    await pool.query(
      "UPDATE customers SET profile_picture = $1 WHERE id = $2",
      [data.image_path, userId]
    );

    // 6. Response
    return res.json({
      message: "Profile updated successfully",
      profile_picture: data.url
    });

  } catch (err) {
    console.error("NODE upload error:", err);
    res.status(500).json({ message: "Upload failed on server." });
  }
});

// Menu Routes

// Fetch menu items
app.get('/api/menu-items', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, type, price, categories, subcategories, description, image_path
      FROM menu_items
      ORDER BY created_at DESC
    `);

    // Base URL for Laravel public storage
    const LARAVEL_BASE_URL = process.env.LARAVEL_BASE_URL || "http://127.0.0.1:8000";

    const items = result.rows.map(item => {
      // Convert Node DB path to Laravel public storage path
      const image_url = `${LARAVEL_BASE_URL}/storage/${item.image_path.replace("menu_images/", "menu-images/")}`;

      // Log for backend debugging
      console.log(`Menu item fetched: id=${item.id}, image_url=${image_url}`);

      return {
        ...item,
        image_url
      };
    });

    res.json(items);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).json({ message: "Server error" });
  }
});

const PRODUCT_ALIASES = {
  /* =======================
     DRINKS
  ======================= */

  "sea salt honey": [
    "sea salt honey",
    "seasalt honey",
    "salt honey",
    "sea honey",
  ],

  "iced snow coffee": [
    "iced snow coffee",
    "ice snow coffee",
    "snow coffee",
    "iced coffee snow",
  ],

  "white chocolate mocha": [
    "white chocolate mocha",
    "white mocha",
    "white choco mocha",
    "white chocolate",
  ],

  "dulce de leche": [
    "dulce de leche",
    "dulce leche",
    "dulce",
  ],

  "classic lemonade": [
    "classic lemonade",
    "lemonade",
    "classic lemon",
  ],

  "strawberry lemonade": [
    "strawberry lemonade",
    "strawberry lemon",
    "strawberry lemon drink",
  ],

  "watermelon with strawberry popping bobba": [
    "watermelon strawberry",
    "watermelon with strawberry",
    "watermelon bobba",
    "watermelon boba",
    "watermelon popping boba",
    "watermelon strawberry boba",
  ],

  "okinawa": [
    "okinawa",
    "okinawa milk tea",
  ],

  "oreo cheesecake overload": [
    "oreo cheesecake",
    "oreo cheesecake overload",
    "oreo cake",
  ],

  "wintermelon": [
    "winter melon",
    "wintermelon",
    "winter melon tea",
  ],

  "oreo": [
    "oreo",
    "oreo milk tea",
  ],

  "pure matcha oat latte": [
    "pure matcha oat latte",
    "matcha oat latte",
    "matcha oat",
    "oat matcha",
  ],

  "specialty matcha": [
    "specialty matcha",
    "speciality matcha",
    "special matcha",
    "premium matcha",
    "matcha",
  ],

  "peach iced tea": [
    "peach iced tea",
    "peach ice tea",
    "peach tea",
  ],

  /* =======================
     FOOD
  ======================= */

  "fries": [
    "fries",
    "french fries",
    "chips",
  ],

  "cheese sticks": [
    "cheese sticks",
    "cheesy sticks",
    "cheese stick",
  ],

  "cheesy corndogs": [
    "cheesy corndogs",
    "cheesy corn dogs",
    "corn dogs",
    "corn dog",
    "corndogs",
  ],

  "platter 3": [
    "platter three",
    "platter number three",
    "platter 3",
    "combo platter",
  ],

  "beef quesadillas": [
    "beef quesadillas",
    "beef quesadilla",
    "quesadilla",
  ],

  "biscoff croffle": [
    "biscoff croffle",
    "biscoff cruffle",
    "biscoff crumple",
    "biscoff waffle",
    "croffle",
    "cruffle",
  ],

  "croffle with whipped cream syrup": [
    "croffle with whipped cream",
    "croffle with syrup",
    "plain croffle",
    "croffle",
  ],
};

app.post("/api/voice-order", authenticateToken, async (req, res) => {
  try {
    const { transcript } = req.body;

    console.log("VOICE ORDER BODY:", req.body);
    console.log("🎙️ VOICE TRANSCRIPT:", transcript);

    /* -------------------------
       0️⃣ Validate input
    ------------------------- */
    if (!transcript || typeof transcript !== "string" || !transcript.trim()) {
      return res.status(400).json({ message: "No text provided" });
    }

    const normalized = transcript.toLowerCase();

    /* -------------------------
       1️⃣ Quantity (default 1)
    ------------------------- */
    let quantity = 1;
    if (/\bone\b/.test(normalized)) quantity = 1;
    if (/\btwo\b/.test(normalized)) quantity = 2;
    if (/\bthree\b/.test(normalized)) quantity = 3;
    if (/\bfour\b/.test(normalized)) quantity = 4;
    if (/\bfive\b/.test(normalized)) quantity = 5;

    /* -------------------------
       2️⃣ Size (ONLY regular / large)
    ------------------------- */
    let size = "regular";
    if (/\blarge\b/.test(normalized)) size = "large";

    /* -------------------------
       3️⃣ Fetch ALL menu items
    ------------------------- */
    const itemsRes = await pool.query(`
      SELECT id, name, price, image_path
      FROM menu_items
    `);

    /* -------------------------
       4️⃣ FUZZY PRODUCT MATCH
    ------------------------- */

    /* -------------------------
      4️⃣ PRODUCT MATCH (ALIASES + FUZZY)
    ------------------------- */

    const clean = (str) =>
      str.toLowerCase().replace(/[^a-z0-9\s]/g, "");

    const cleanedTranscript = clean(normalized);

    let match = null;

    /* ---- 4A️⃣ Alias match (HIGH CONFIDENCE) ---- */
    for (const item of itemsRes.rows) {
      const normalizeKey = (str) =>
        str
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .trim();

      const itemKey = normalizeKey(item.name);
      const aliases = PRODUCT_ALIASES[itemKey];
      if (!aliases) continue;

      for (const alias of aliases) {
        const aliasWords = clean(alias).split(" ");

        const hit = aliasWords.every(word =>
          cleanedTranscript.includes(word)
        );

        if (hit) {
          match = item;
          break;
        }
      }
      if (match) break;
    }

    /* ---- 4B️⃣ Fallback fuzzy match ---- */
    if (!match) {
      const tokenize = (str) =>
        str
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .split(/\s+/)
          .filter(w => w.length > 2);

      const transcriptWords = tokenize(cleanedTranscript);

      let bestScore = 0;

      for (const item of itemsRes.rows) {
        const nameWords = tokenize(item.name);

        const score = nameWords.filter(word =>
          transcriptWords.includes(word)
        ).length;

        if (score > bestScore) {
          bestScore = score;
          match = item;
        }
      }

      if (!match || bestScore === 0) {
        return res.status(404).json({
          message: "The following product isn't available or recognized",
        });
      }
    }

    /* -------------------------
       5️⃣ Resolve price by size
    ------------------------- */
    const priceObj = match.price || {};
    const finalSize = priceObj[size] ? size : "regular";
    const price = priceObj[finalSize];

    if (!price) {
      return res.status(400).json({
        message: "Invalid size for this product",
      });
    }

    /* -------------------------
       6️⃣ Resolve image path (FIXED)
    ------------------------- */
    const resolvedImage = resolveImageUrl(match.image_path, req);

    /* -------------------------
       7️⃣ Return parsed result
    ------------------------- */
    return res.json({
      product: {
        product_id: match.id,
        product_name: match.name,
        size: finalSize,
        quantity,
        price,
        image: resolvedImage,
      },
    });

  } catch (err) {
    console.error("❌ Voice order error:", err);
    res.status(500).json({ message: "Voice order failed" });
  }
});

// Adding Items to Cart
app.post('/api/cart', authenticateToken, async (req, res) => {
  const {
    product_id,
    product_name,
    size,
    quantity,
    instructions,
    price,
    image,
    is_free = false,
  } = req.body;

  if (is_free) {
    const loyalty = await pool.query(
      `SELECT free_drinks FROM loyalty WHERE customer_id = $1`,
      [req.userId]
    );

    if (!loyalty.rows.length || loyalty.rows[0].free_drinks <= 0) {
      return res.status(400).json({ message: "No free drinks available." });
    }
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO cart_items
      (customer_id, product_id, product_name, size, quantity, instructions, price, image, is_free, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *
      `,
      [
        req.userId,
        product_id,
        product_name,
        size,
        quantity,
        instructions,
        Number(price),
        image,
        is_free
      ]
    );

    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Getting Cart Items
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        ci.id,
        ci.product_id,
        ci.product_name,        -- ✅ USE STORED NAME
        mi.type,                -- still useful
        ci.size,
        ci.quantity,
        ci.instructions,
        ci.price::numeric(10,2) AS price,
        ci.image,
        ci.is_free,
        ci.created_at
      FROM cart_items ci
      LEFT JOIN menu_items mi ON mi.id = ci.product_id
      WHERE ci.customer_id = $1
      ORDER BY ci.created_at DESC
      `,
      [req.userId]
    );

    console.log("🛒 CART ROWS FOR USER", req.userId);
    console.table(result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/cart/clear-checked", authenticateToken, async (req, res) => {
  const userId = req.userId;
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: "No product IDs provided" });
  }

  try {
    await pool.query(
      `
      DELETE FROM cart_items
      WHERE customer_id = $1
        AND product_id = ANY($2::int[])
      `,
      [userId, productIds]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Clear checked cart error:", err);
    res.status(500).json({ message: "Failed to clear checked items" });
  }
});

// Remove Cart Items
app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    // 1️⃣ Check if item is free
    const check = await pool.query(
      `SELECT is_free FROM cart_items WHERE id = $1 AND customer_id = $2`,
      [req.params.id, req.userId]
    );

    if (!check.rows.length) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (check.rows[0].is_free) {
      return res.status(403).json({
        message: "Free reward items cannot be removed"
      });
    }

    // 2️⃣ Safe to delete
    await pool.query(
      'DELETE FROM cart_items WHERE id = $1 AND customer_id = $2',
      [req.params.id, req.userId]
    );

    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Cart Item
app.put("/api/cart/:id", authenticateToken, async (req, res) => {
  const { quantity, size, instructions } = req.body;

  try {
    // 1️⃣ Check if item is free
    const check = await pool.query(
      `SELECT is_free FROM cart_items WHERE id = $1 AND customer_id = $2`,
      [req.params.id, req.userId]
    );

    if (!check.rows.length) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (check.rows[0].is_free) {
      return res.status(403).json({
        message: "Free reward items cannot be modified"
      });
    }

    // 2️⃣ Safe to update
    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1, size = $2, instructions = $3
       WHERE id = $4 AND customer_id = $5
       RETURNING *`,
      [quantity, size, instructions, req.params.id, req.userId]
    );

    res.json({
      message: "Cart item updated",
      item: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating cart:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Completed Orders
app.get("/api/orders/completed", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, order_code, total_amount, payment_method, status, created_at
       FROM orders
       WHERE user_id = $1 AND status = 'completed'
       ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching completed orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Cancelled Orders
app.get("/api/orders/cancelled", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, order_code, total_amount, payment_method, status, created_at
       FROM orders
       WHERE user_id = $1 AND status = 'canceled'
       ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cancelled orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Checkout route
app.post("/api/checkout", authenticateToken, async (req, res) => {
  const userId = req.userId;
  let { cartItems, paymentMethod, totalAmount, address, fulfillmentMethod } = req.body;

  const safeFulfillment =
  fulfillmentMethod === "delivery" || fulfillmentMethod === "pickup"
    ? fulfillmentMethod
    : null;
    
  console.log("Raw checkout body:", req.body); 

  try {
    // -----------------------------
    // Normalize cartItems
    // -----------------------------
    if (typeof cartItems === "string") {
      try {
        cartItems = JSON.parse(cartItems);
      } catch (err) {
        console.error("❌ Failed to parse cartItems JSON:", err);
        return res.status(400).json({ message: "Invalid cartItems format." });
      }
    }

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ message: "cartItems must be an array." });
    }

    // -----------------------------
    // Fetch user info
    // -----------------------------
    const userResult = await pool.query(
      "SELECT full_name, email FROM customers WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userResult.rows[0];

    // -----------------------------
    // Order metadata
    // -----------------------------
    const orderCode = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const orderStatus =
      paymentMethod === "Pay on Pickup" ? "completed" : "pending";

    let transactionId = null;
    
    if (paymentMethod === "Pay on Pickup") {
      transactionId = "TXN-" + crypto.randomUUID();
    }

    // -----------------------------
    // Fetch product types from menu_items
    // -----------------------------
    const productIds = [
      ...new Set(
        cartItems
          .filter(i => i.product_id || i.id)
          .map(i => Number(i.product_id ?? i.id))
      )
    ];

    const menuResult = await pool.query(
      `SELECT id, type FROM menu_items WHERE id = ANY($1)`,
      [productIds]
    );

    const typeMap = {};
    menuResult.rows.forEach(row => {
      typeMap[row.id] = row.type;
    });

    // -----------------------------
    // Build items JSON (STRICT)
    // -----------------------------
    const orderItems = cartItems.map((i) => {
    const productId = Number(i.product_id ?? i.id);

      return {
        id: productId,
        name: i.product_name ?? i.name,
        type: typeMap[productId] ?? "food", 
        size: i.size ?? null,
        quantity: Number(i.quantity) || 0,  
        price: Number(i.price) || 0,
        image: i.image ?? null,
        instructions: i.instructions ?? "",
        is_free: Boolean(i.is_free),
      };
    });

    // -----------------------------
    // Recalculate total (exclude free items)
    // -----------------------------
    const recalculatedTotal = orderItems.reduce((sum, i) => {
      if (i.is_free) return sum;           // 👈 FREE DRINKS = ₱0
      return sum + i.price * i.quantity;
    }, 0);

    const safeItems = JSON.stringify(orderItems); 
    const safeFulfillmentMethod = fulfillmentMethod ?? null;

    console.log("INSERT DEBUG:", {
      itemsType: typeof safeItems,
      fulfillmentMethodType: typeof safeFulfillmentMethod,
      fulfillmentMethod: safeFulfillmentMethod,
      itemsPreview: orderItems,
    });

    // -----------------------------
    // INSERT (LOCKED ORDER)
    // -----------------------------
    const insertOrderQuery = `
      INSERT INTO orders (
        user_id,
        payment_method,
        total_amount,
        status,
        transaction_id,
        order_code,
        customer_name,
        customer_email,
        customer_address,
        items,
        fulfillment_method,
        created_at
      )
      VALUES (
        $1,  -- user_id
        $2,  -- payment_method
        $3,  -- total_amount
        $4,  -- status
        $5,  -- transaction_id
        $6,  -- order_code
        $7,  -- customer_name
        $8,  -- customer_email
        $9,  -- customer_address
        $10, -- items (JSONB)
        $11, -- fulfillment_method
        NOW()
      )
      RETURNING *;
    `;

    const orderResult = await pool.query(insertOrderQuery, [
      userId,                  // $1
      paymentMethod,           // $2
      recalculatedTotal,       // $3
      orderStatus,             // $4
      transactionId,           // $5
      orderCode,               // $6
      user.full_name,          // $7
      user.email,              // $8
      address || null,         // $9
      safeItems,               // $10 
      safeFulfillmentMethod,   // $11 
    ]);

    console.log("✅ Order saved correctly:", orderResult.rows[0]);

    if (orderStatus === "completed") {
      await applyLoyaltyForCompletedOrders(userId);
    }

    // -----------------------------
    // DEDUCT FREE DRINKS (AFTER ORDER SUCCESS)
    // -----------------------------
    const freeDrinkCount = orderItems.reduce((count, item) => {
      if (item.is_free) return count + item.quantity;
      return count;
    }, 0);

    if (freeDrinkCount > 0) {
      await pool.query(
        `
        UPDATE loyalty
        SET free_drinks = GREATEST(free_drinks - $1, 0)
        WHERE customer_id = $2
        `,
        [freeDrinkCount, userId]
      );

      console.log("🍹 Deducted free drinks:", freeDrinkCount);
    }

    // -----------------------------
    // CLEAR ONLY CHECKED CART ITEMS
    // -----------------------------
    const cartItemIdsToDelete = cartItems.map(i => i.cart_item_id ?? i.id);

    await pool.query(
      `
      DELETE FROM cart_items
      WHERE id = ANY($1::int[])
        AND customer_id = $2
      `,
      [cartItemIdsToDelete, userId]
    );

    console.log("🧹 Cleared ONLY checked cart items:", cartItemIdsToDelete);


    // -----------------------------
    // Response
    // -----------------------------
    res.status(200).json({
      message: "Order placed successfully",
      order_code: orderCode,
      transaction_id: transactionId,
      status: orderStatus,
      items: orderItems,
    });

  } catch (err) {
    console.error("❌ Checkout error:", err);
    res.status(500).json({
      message: "Server error during checkout",
      error: err.message,
    });
  }
});

// GCash Payment Intent via PayMongo
app.post("/api/paymongo/gcash", authenticateToken, async (req, res) => {
    if (!PUBLIC_URL || !PUBLIC_URL.startsWith("https://")) {
    console.error("❌ INVALID PUBLIC_URL:", PUBLIC_URL);
    return res.status(500).json({
      message: "Server misconfiguration: PUBLIC_URL is invalid",
    });
  }

  const { amount, phone_number, order_code } = req.body;

  console.log("GCash init request:", { amount, phone_number, order_code });

  if (!amount || !phone_number || !order_code) {
    return res.status(400).json({
      message: "Amount, phone number, and order_code are required.",
    });
  }

  try {
    // 🔹 GET CUSTOMER DETAILS FROM ORDER
    const orderResult = await pool.query(
      `
      SELECT customer_name, customer_email
      FROM orders
      WHERE order_code = $1
      `,
      [order_code]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found." });
    }

    const { customer_name, customer_email } = orderResult.rows[0];

    if (!customer_name || !customer_email) {
      await pool.query(
        `UPDATE orders SET status = 'canceled' WHERE order_code = $1`,
        [order_code]
      );

      return res.status(400).json({
        message: "Customer name or email is missing. Please complete your profile."
      });
    }

    console.log("Using billing info:", {
      name: customer_name.trim(),
      email: customer_email.trim(),
      phone: `+63${phone_number.slice(-10)}`,
    });

    // 🔹 CREATE PAYMONGO SOURCE
    const response = await fetch(`${PAYMONGO_URL}/sources`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(PAYMONGO_SECRET + ":").toString("base64"),
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: Math.round(amount * 100),
            currency: "PHP",
            type: "gcash",
            redirect: {
              success: `${PUBLIC_URL}/api/paymongo/redirect/success`,
              failed: `${PUBLIC_URL}/api/paymongo/redirect/failed`,
            },
            billing: {
              name: customer_name.trim(),
              email: customer_email.trim(),
              phone: `+63${phone_number.slice(-10)}`,
            },
          },
        },
      }),
    });

    const paymongoData = await response.json();

    if (!response.ok) {
      console.error("❌ PayMongo source failed:", paymongoData);

      await pool.query(
        `UPDATE orders SET status = 'canceled' WHERE order_code = $1`,
        [order_code]
      );

      return res.status(400).json({
        message: "Unable to initiate GCash payment.",
      });
    }

    const sourceId = paymongoData.data.id;
    const redirectUrl = paymongoData.data.attributes.redirect.checkout_url;

    console.log("✅ PayMongo source created:", { sourceId });

    // ✅ SAVE SOURCE ID
    await pool.query(
      `
      UPDATE orders
      SET source_id = $1
      WHERE order_code = $2
      `,
      [sourceId, order_code]
    );

    return res.status(200).json({
      source_id: sourceId,
      redirect_url: redirectUrl,
    });
  } catch (err) {
    console.error("❌ GCash error:", err);

    // ❌ FAIL SAFE
    await pool.query(
      `UPDATE orders SET status = 'canceled' WHERE order_code = $1`,
      [req.body.order_code]
    );

    return res.status(500).json({
      message: "GCash payment failed.",
    });
  }
});

// Get total drinks purchased (completed orders)
app.get("/api/loyalty/progress", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `
      SELECT
        COALESCE(drink_count, 0) AS drink_count,
        COALESCE(free_drinks, 0) AS free_drinks
      FROM loyalty
      WHERE customer_id = $1
      `,
      [userId]
    );

    const row = result.rows[0] || { drink_count: 0, free_drinks: 0 };

    res.json({
      progress: row.drink_count % 10,
      freeDrinksEarned: row.free_drinks,
    });
  } catch (err) {
    console.error("Failed to load loyalty progress:", err);
    res.status(200).json({
      progress: 0,
      freeDrinksEarned: 0,
    });
  }
});

app.get("/api/loyalty/status", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `
      SELECT
        COALESCE(free_drinks, 0) AS free_drinks
      FROM loyalty
      WHERE customer_id = $1
      `,
      [userId]
    );

    // ✅ ALWAYS return JSON
    res.json({
      free_drinks: result.rows.length > 0 ? Number(result.rows[0].free_drinks) : 0,
    });
  } catch (err) {
    console.error("Failed to load loyalty status:", err);
    res.status(200).json({ free_drinks: 0 }); // ⬅ prevent HTML error
  }
});

// Get Pending Orders
app.get("/api/orders/pending", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, order_code, total_amount, payment_method, status, created_at
       FROM orders
       WHERE user_id = $1 AND status = 'pending'
       ORDER BY created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching pending orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Send OTP for GCash
app.post("/api/gcash/send-otp", authenticateToken, async (req, res) => {
  const { email } = req.body;

  console.log("📨 OTP request received:", email);

  if (!email) {
    console.warn("❌ OTP failed: email missing");
    return res.status(400).json({ message: "Email required." });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otpCode;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your GCash Payment OTP",
    text: `Your GCash OTP is: ${otpCode}`,
  });

  console.log("✅ Sent GCash OTP:", {
    email,
    otp: otpCode,
    time: new Date().toISOString(),
  });

  res.json({ message: "OTP sent to your email." });
});

// Verify OTP
app.post("/api/gcash/verify-otp", authenticateToken, (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required." });

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; // clear after use
    return res.json({ verified: true, message: "OTP verified successfully." });
  }

  return res.status(400).json({ verified: false, message: "Invalid OTP." });
});

// Get customer profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, gender, birthday, phone_number, profile_picture
       FROM customers 
       WHERE id = $1`,
      [req.userId]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found." });

    // Return the correct Laravel image URL
    const user = result.rows[0];
    const LOCAL_LARAVEL = "http://127.0.0.1:8000";  
    const EMULATOR_LARAVEL = "http://10.0.2.2:8000";  
    const isAndroidEmulator = req.headers['user-agent']?.includes("okhttp");

    const baseUrl = isAndroidEmulator ? EMULATOR_LARAVEL : LOCAL_LARAVEL;

    if (user.profile_picture) {
      const storagePath = user.profile_picture;
      const finalUrl = `${baseUrl}/storage/${storagePath}`;

      console.log("-------- PROFILE IMAGE DEBUG --------");
      console.log("Raw DB value:         ", storagePath);
      console.log("Final URL Returned:   ", finalUrl);
      console.log("Client Type:          ", isAndroidEmulator ? "Android Emulator" : "Web Browser / Node");
      console.log("------------------------------------");

      user.profile_picture = finalUrl;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Update customer profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  const { full_name, email, gender, birthday, phone_number } = req.body;
  try {
    const result = await pool.query(
      `UPDATE customers 
       SET full_name = $1, email = $2, gender = $3, birthday = $4, phone_number = $5
       WHERE id = $6
       RETURNING id, full_name, email, gender, birthday, phone_number`,
      [full_name, email, gender, birthday, phone_number, req.userId]
    );
    res.json({ message: "Profile updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Submit feedback
app.post('/api/feedback', authenticateToken, async (req, res) => {
  const { rating, description } = req.body;
  try {
    await pool.query(
      `INSERT INTO feedback (user_id, rating, description, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [req.userId, rating, description]
    );
    res.json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Convert audio to text
app.post("/api/voice-transcribe", authenticateToken, upload.single("audio"), async (req, res) => {
  try {
    const audioFile = fs.createReadStream(req.file.path);

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "gpt-4o-mini-transcribe", // Or "whisper-1" if enabled
      response_format: "text",
    });

    fs.unlinkSync(req.file.path); // Clean temp file
    res.json({ text: transcription });
  } catch (error) {
    console.error("Transcription error:", error);
    res.status(500).json({ message: "Error transcribing audio." });
  }
});

async function applyLoyaltyForCompletedOrders(userId) {
  // 1️⃣ Get completed, uncounted orders
  const ordersRes = await pool.query(
    `
    SELECT id, items
    FROM orders
    WHERE user_id = $1
      AND status = 'completed'
      AND loyalty_counted = false
    `,
    [userId]
  );

  if (ordersRes.rows.length === 0) return;

  let drinkTotal = 0;

  // 2️⃣ Sum drink quantities (exclude free drinks)
  for (const order of ordersRes.rows) {
    const items = Array.isArray(order.items) ? order.items : [];

    for (const item of items) {
      if (
        item.type === "drink" &&
        item.is_free === false &&
        Number(item.quantity) > 0
      ) {
        drinkTotal += Number(item.quantity);
      }
    }
  }

  if (drinkTotal === 0) {
    // still mark orders as counted
    await pool.query(
      `
      UPDATE orders
      SET loyalty_counted = true
      WHERE id = ANY($1)
      `,
      [ordersRes.rows.map(o => o.id)]
    );
    return;
  }

  // 3️⃣ Upsert loyalty row
  await pool.query(
    `
    INSERT INTO loyalty (customer_id, drink_count)
    VALUES ($1, $2)
    ON CONFLICT (customer_id)
    DO UPDATE
    SET drink_count = loyalty.drink_count + $2,
        updated_at = NOW()
    `,
    [userId, drinkTotal]
  );

  // 4️⃣ Update free drinks (example: every 10 drinks)
  await pool.query(
    `
    UPDATE loyalty
    SET free_drinks = FLOOR(drink_count / 10)
    WHERE customer_id = $1
    `,
    [userId]
  );

  // 5️⃣ Mark orders as counted
  await pool.query(
    `
    UPDATE orders
    SET loyalty_counted = true
    WHERE id = ANY($1)
    `,
    [ordersRes.rows.map(o => o.id)]
  );
}

const PORT = 5000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log('Server running on all interfaces');

  try {
    await setupLoyaltyTrigger();
  } catch (err) {
    console.error("❌ Failed to setup loyalty trigger:", err);
  }
});


