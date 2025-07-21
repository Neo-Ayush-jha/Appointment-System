const db = require("../config/db"); // Make sure this is from mysql2/promise
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sendVerificationEmail } = require("../utils/mailer");

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    await sendVerificationEmail({ name, email, role }, token);

    res.status(200).json({
      success: true,
      message: "User registered. Please verify your email within 5 minutes.",
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({
      success: false,
      message: "Signup failed",
      error: err.message || err.toString(),
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    console.error("Login Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: "Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    try {
      const [rows] = await db.query(
        "SELECT is_verified FROM users WHERE email = ?",
        [decoded.email]
      );

      if (!rows || rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (rows[0].is_verified) {
        return res
          .status(400)
          .json({ success: false, message: "Email already verified" });
      }

      await db.query("UPDATE users SET is_verified = 1 WHERE email = ?", [
        decoded.email,
      ]);

      res.status(200).json({
        success: true,
        message: "Email verified successfully. You can now log in.",
      });
    } catch (dbError) {
      res.status(500).json({
        success: false,
        message: "Database error",
        error: dbError.message,
      });
    }
  });
};

const pool = require("../config/db");

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Get the user details
    const [userRows] = await pool.query(
      `SELECT id, name, email, role, is_verified, organization_id FROM users WHERE id = ?`,
      [userId]
    );

    if (!userRows.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userRows[0];

    // Step 2: Get organization details if present
    let organization = null;
    if (user.organization_id) {
      const [orgRows] = await pool.query(
        `SELECT id, name, description, established_date, address, phone, email FROM organizations WHERE id = ?`,
        [user.organization_id]
      );
      organization = orgRows.length ? orgRows[0] : null;
    }

    // Step 3: Get all appointments (as customer or professional)
    const [appointments] = await pool.query(
      `SELECT 
        id, user_id, professional_id, date, time, pending_date, pending_time,
        status, service, duration, price, notes 
       FROM appointments 
       WHERE user_id = ? OR professional_id = ?`,
      [userId, userId]
    );

    // Step 4: Get all feedbacks given by the user
    const [feedbacks] = await pool.query(
      `SELECT 
        id, appointment_id, rating, experience, suggestion, image_url, created_at 
       FROM feedbacks 
       WHERE user_id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      user: {
        ...user,
        organization,
        appointments,
        feedbacks,
      },
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

