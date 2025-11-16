function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log("Incoming token:", token ? token.slice(0, 40) + "..." : "None"); 

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.sendStatus(403);
    }
    req.userId = decoded.userId;
    console.log("Token verified for user:", decoded.userId);
    next();
  });
}

const dotenv = require('dotenv'); 
dotenv.config({ path: __dirname + '/.env' }); 

const express = require('express');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const googleClient = new OAuth2Client('1018371869413-d6k2ancgs59ujstbuu8j6b38lo6foec8.apps.googleusercontent.com');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

console.log("Email user:", process.env.EMAIL_USER);
console.log("Email pass exists:", !!process.env.EMAIL_PASS);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = 'CFoJy9csauDWon3fhdTcviGLMZt6afHm'; 

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

    // no expiry check here
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
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, '', true]
      );
    }

    const sessionToken = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ sessionToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Google token.' });
  }
});

// Facebook sign-in route
app.post('/api/facebook-login', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify token with Facebook Graph API
    const fbResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
    const fbUser = await fbResponse.json();

    if (!fbUser.email) return res.status(400).json({ message: 'Email permission required' });

    let user = await pool.query('SELECT * FROM customers WHERE email = $1', [fbUser.email]);
    if (user.rows.length === 0) {
      user = await pool.query(
        `INSERT INTO customers (full_name, email, password_hash, email_verified)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [fbUser.name, fbUser.email, '', true]
      );
    }

    const sessionToken = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ sessionToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid Facebook token.' });
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
      'UPDATE customers SET email_verified = true, otp_code = NULL, otp_token = NULL, otp_expiry = NULL WHERE id = $1',
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

// Menu Routes

// Adding Items to Cart
// Add Item to Cart with created_at timestamp
app.post('/api/cart', authenticateToken, async (req, res) => {
  const { product_id, product_name, size, quantity, instructions, price, image } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO cart_items 
        (customer_id, product_id, product_name, size, quantity, instructions, price, image, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
       RETURNING *`,
      [req.userId, product_id, product_name, size, quantity, instructions, Number(price), image]
    );

    res.json({ message: "Added to cart", item: result.rows[0] });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Getting Cart Items
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, customer_id, product_id, product_name, size, quantity,
              instructions, price::numeric(10,2) AS price, image, created_at
       FROM cart_items
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    );

    console.log("Sending cart items:", result.rows.map(r => ({
      id: r.id,
      created_at: r.created_at,
    })));

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove Cart Items
app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
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
    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1, size = $2, instructions = $3
       WHERE id = $4 AND customer_id = $5
       RETURNING *`,
      [quantity, size, instructions, req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({
      message: "Cart item updated",
      item: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating cart:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
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
  let { cartItems, paymentMethod, totalAmount, address } = req.body;

  console.log("📦 Raw checkout body:", req.body);

  try {
    // Safely handle cartItems (could be JSON string or array)
    if (typeof cartItems === "string") {
      try {
        cartItems = JSON.parse(cartItems);
      } catch (err) {
        console.error("❌ Failed to parse cartItems JSON:", err);
        cartItems = [];
      }
    }

    if (!Array.isArray(cartItems)) {
      console.warn("cartItems is not an array, defaulting to empty array");
      cartItems = [];
    }

    console.log("Parsed cartItems:", cartItems);

    // Fetch user info
    const userResult = await pool.query(
      "SELECT full_name, email FROM customers WHERE id = $1",
      [userId]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create order metadata
    const orderCode = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    let transactionId = null;
    let orderStatus = "pending";

    if (paymentMethod === "Pay on Pickup") {
      transactionId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
    }

    // Build item array
    const orderItems = cartItems.map((i) => ({
      id: i.product_id || i.id,
      name: i.product_name,
      size: i.size || null,
      quantity: Number(i.quantity),
      price: Number(i.price),
      is_free: i.is_free || false,
      image: i.image || null,
      instructions: i.instructions || "",
    }));

    console.log("🧾 Final orderItems to store:", orderItems);

    // Insert into orders (with JSONB)
    const insertOrder = `
      INSERT INTO orders (
        user_id, payment_method, total_amount, status,
        transaction_id, order_code, customer_name, customer_email,
        customer_address, items, created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
      RETURNING *;
    `;

    const orderResult = await pool.query(insertOrder, [
      userId,
      paymentMethod,
      totalAmount,
      orderStatus,
      transactionId,
      orderCode,
      user.full_name,
      user.email,
      address || null,
      JSON.stringify(orderItems),
    ]);

    console.log("✅ Order saved:", orderResult.rows[0]);

    res.status(200).json({
      message: "Order placed successfully",
      order_code: orderCode,
      transaction_id: transactionId,
      full_name: user.full_name,
      email: user.email,
      status: orderStatus,
      items: orderItems,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error during checkout", error: err.message });
  }
});

// GCash Payment Intent via PayMongo
app.post("/api/paymongo/gcash", authenticateToken, async (req, res) => {
  const { amount, phone_number } = req.body;
  const userId = req.userId;
  const userAgent = req.headers["user-agent"] || "";
  const isMobileApp = /okhttp|reactnative|mobile/i.test(userAgent);

  console.log("Received from frontend:", { amount, phone_number });

  if (!amount || !phone_number) {
    return res.status(400).json({ message: "Amount and phone number are required." });
  }

  try {
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
            redirect: {
              success: `${PUBLIC_URL}/api/paymongo/success`,
              failed: `${PUBLIC_URL}/api/paymongo/failed`,
            },
            type: "gcash",
            currency: "PHP",
            billing: {
              name: "Customer",
              phone: phone_number,
              email: "test@example.com",
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) return res.status(400).json(data);
    const sourceId = data.data.id;

    await pool.query(
      `UPDATE orders SET source_id = $1 WHERE user_id = $2 AND status = 'pending' AND source_id IS NULL`,
      [sourceId, userId]
    );

    res.status(200).json({
      redirect_url: isMobileApp ? null : data.data.attributes.redirect.checkout_url,
      source_id: sourceId,
      message: isMobileApp
        ? "GCash payment initialized. Wait for webhook confirmation."
        : "GCash redirect available for browser checkout.",
    });
  } catch (err) {
    console.error("PayMongo GCash error:", err);
    res.status(500).json({ message: "GCash payment failed." });
  }
});

// Get total drinks purchased (completed orders)
app.get("/api/loyalty/progress", authenticateToken, async (req, res) => {
  try {
    // Fetch completed orders for the user
    const ordersRes = await pool.query(
      `SELECT items
       FROM orders
       WHERE user_id = $1 AND status = 'completed'`,
      [req.userId]
    );

    if (ordersRes.rows.length === 0) {
      return res.json({ totalDrinks: 0 });
    }

    let totalDrinks = 0;

    // Loop through orders and parse items
    for (const row of ordersRes.rows) {
      let items = [];

      if (typeof row.items === "string") {
        try {
          items = JSON.parse(row.items);
        } catch (err) {
          console.warn("Skipping invalid items JSON in order:", row.items);
          continue;
        }
      } else if (Array.isArray(row.items)) {
        items = row.items;
      }

      for (const item of items) {
        const name = (item.name || item.product_name || "").toLowerCase();
        const cat = (item.category || "").toLowerCase();
        const type = (item.type || "").toLowerCase();

        // Count it if it's a drink
        if (
          name.includes("coffee") ||
          cat.includes("drink") ||
          type === "drink"
        ) {
          totalDrinks += Number(item.quantity || 0);
        }
      }
    }

    console.log(`🥤 Total completed drinks for user ${req.userId}:`, totalDrinks);
    res.json({ totalDrinks });
  } catch (err) {
    console.error("Error in /api/loyalty/progress:", err);
    res.status(500).json({ message: "Server error calculating loyalty progress." });
  }
});

// Webhook from PayMongo
app.post("/api/paymongo/webhook", async (req, res) => {
  try {
    console.log("Webhook received:", JSON.stringify(req.body, null, 2));

    const event = req.body.data;
    const { type, data } = event;

    // Triggered when the GCash source becomes chargeable
    if (type === "source.chargeable") {
      const sourceId = data.id;
      console.log("GCash payment source chargeable:", sourceId);
    }

    // Triggered when the payment is fully paid
    else if (type === "payment.paid") {
      const payment = data.attributes;
      const txnId = payment.id;
      const sourceId = payment.source.data.id;

      // Update order status
      const result = await pool.query(
        "UPDATE orders SET status = 'paid', transaction_id = $1 WHERE source_id = $2 RETURNING *",
        [txnId, sourceId]
      );

      if (result.rowCount > 0) {
        console.log("Payment confirmed via webhook:", result.rows[0]);

        // (Optional) You can send confirmation email/notification here
      } else {
        console.warn("No matching pending order found for this payment.");
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ success: false });
  }
});

// PayMongo success redirect
app.get("/api/paymongo/success", (req, res) => {
  res.send("Payment successful. You may close this window.");
  res.status(200).send(`
    <html>
      <head>
        <title>Payment Successful</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0fdf4; color: #166534; }
          h1 { font-size: 2em; }
          p { font-size: 1.2em; }
        </style>
      </head>
      <body>
        <h1>✅ Payment Successful!</h1>
        <p>You can now close this window or return to the app.</p>
      </body>
    </html>
  `);
});

// PayMongo failed or cancelled redirect
app.get("/api/paymongo/failed", (req, res) => {
  res.send("Payment failed or cancelled.");
  res.status(400).send(`
    <html>
      <head>
        <title>Payment Failed</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #fef2f2; color: #991b1b; }
          h1 { font-size: 2em; }
          p { font-size: 1.2em; }
        </style>
      </head>
      <body>
        <h1>❌ Payment Failed</h1>
        <p>Something went wrong or you cancelled the payment.<br>Please try again.</p>
      </body>
    </html>
  `);
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
  if (!email) return res.status(400).json({ message: "Email required." });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otpCode;

  // Send via email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your GCash Payment OTP",
    text: `Your GCash OTP is: ${otpCode}`,
  });

  console.log("Sent GCash OTP to", email, otpCode);
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
      `SELECT id, full_name, email, gender, birthday, phone_number 
       FROM customers 
       WHERE id = $1`,
      [req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "User not found." });
    res.json(result.rows[0]);
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

// Voice order processing
app.post("/api/voice-order", authenticateToken, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "No text provided." });
  }

  try {
    // Ask GPT to extract structured order info
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a voice order assistant. Extract food order details (product, quantity, size, special instructions) from user speech.",
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(aiResponse.choices[0].message.content);
    const { product_name, quantity, size, instructions } = parsed;

    if (!product_name) {
      return res.status(404).json({ message: "Could not match product." });
    }

    // Example price base logic
    const priceBase = { small: 50, medium: 60, large: 70 };
    const totalPrice = priceBase[size] * quantity;

    // Save to DB
    const result = await pool.query(
      `INSERT INTO cart_items (customer_id, product_name, size, quantity, instructions, price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.userId, product_name, size, quantity, instructions || "", totalPrice]
    );

    res.json({
      message: "Voice order added to cart!",
      recognized: result.rows[0],
    });
  } catch (err) {
    console.error("AI voice order error:", err);
    res.status(500).json({ message: "Failed to process voice order." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
