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

app.post('/api/register', async (req, res) => {
  const { email, password, phone } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO customers (
        email, 
        password_hash, 
        phone_number, 
        email_verified
      ) VALUES ($1, $2, $3, $4) 
      RETURNING id, email, email_verified`,
      [email, hashedPassword, phone, true]  
    );

    res.status(201).json({ message: 'User registered', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({ message: 'Email already exists.' });
    } else {
      res.status(500).json({ message: 'Server error.' });
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

    res.json({ message: 'OTP verified. Login complete.', token: sessionToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token.' });
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
