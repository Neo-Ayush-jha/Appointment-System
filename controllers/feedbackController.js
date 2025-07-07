const multer = require("multer");
const path = require("path");
const db = require("../config/db"); 

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/feedback_images");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `feedback-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

exports.submitFeedback = [
  upload.single("image"),

  async (req, res) => {
    const appointmentId = req.params.id;
    const userId = req.user.id;
    const { rating, experience, suggestion } = req.body;

    try {
      const [rows] = await db.query(
        `SELECT * FROM appointments WHERE id = ? AND user_id = ?`,
        [appointmentId, userId]
      );

      if (!rows.length) {
        return res.status(403).json({
          success: false,
          message: "Access denied or appointment not found.",
        });
      }

      const appointment = rows[0];
      const now = new Date();
      const start = new Date(`${appointment.date}T${appointment.time}`);
      const end = new Date(start.getTime() + appointment.duration * 60000);

      if (now < end) {
        return res.status(400).json({
          success: false,
          message: "Feedback can only be submitted after the appointment ends.",
        });
      }

      const imageUrl = req.file
        ? `/uploads/feedback_images/${req.file.filename}`
        : null;

      await db.query(
        `INSERT INTO feedbacks (appointment_id, user_id, professional_id, rating, experience, suggestion, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          appointmentId,
          userId,
          appointment.professional_id,
          parseFloat(rating),
          experience,
          suggestion,
          imageUrl,
        ]
      );

      res.status(201).json({ success: true, message: "Feedback submitted!" });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error submitting feedback",
        error: err.message,
      });
    }
  },
];
