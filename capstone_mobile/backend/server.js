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
    const otpToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '5m' });
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await pool.query(
      `UPDATE customers 
       SET otp_code = $1, otp_token = $2, otp_expiry = $3 
       WHERE id = $4`,
      [otpCode, otpToken, expiry, user.id]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Login OTP Code',
      text: `Your OTP code is: ${otpCode}`
    });

    // ✅ no expiry check here
    res.json({ message: 'OTP sent to email.', otp_token: otpToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
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
    const passwordExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await pool.query(
      `UPDATE customers 
       SET password_otp_code = $1, password_otp_token = $2, password_otp_expiry = $3 
       WHERE id = $4`,
      [passwordOtpCode, passwordOtpToken, passwordExpiry, user.id]
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
app.post('/api/cart', authenticateToken, async (req, res) => {
  const { product_id, product_name, size, quantity, instructions, price, image } = req.body;

  console.log("Backend received Add to Cart:", req.body); // Debug

  try {
    const result = await pool.query(
      `INSERT INTO cart_items 
        (customer_id, product_id, product_name, size, quantity, instructions, price, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
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
              instructions, price::numeric(10,2) AS price, image
       FROM cart_items
       WHERE customer_id = $1`,
      [req.userId]
    );
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

// Checkout route
app.post("/api/checkout", authenticateToken, async (req, res) => {
  try {
    const { cartItems, paymentMethod, totalAmount } = req.body;
    const userId = req.user.id;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const client = await pool.connect();

    // Save order to "orders" table
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, payment_method, total_amount, status, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id`,
      [userId, paymentMethod, totalAmount, "pending"]
    );
    const orderId = orderRes.rows[0].id;

    // Save ordered items
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, instructions)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, item.price, item.instructions || ""]
      );
    }

    // 🪙 If payment is GCash
    if (paymentMethod === "GCash") {
      // Mock GCash integration (replace this with real GCash API)
      const transactionId = "TXN-" + Math.floor(100000 + Math.random() * 900000);
      await client.query(
        `UPDATE orders SET status=$1, transaction_id=$2 WHERE id=$3`,
        ["paid", transactionId, orderId]
      );

      res.json({
        message: "Payment successful via GCash",
        transaction_id: transactionId,
        estimated_time: "25–30 minutes",
      });
    } else {
      res.json({
        message: "Order placed successfully (Pay on Pickup)",
        transaction_id: "TXN-" + Math.floor(100000 + Math.random() * 900000),
        estimated_time: "25–30 minutes",
      });
    }

    client.release();
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error during checkout" });
  }
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
