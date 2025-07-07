const express = require("express");
const router = express.Router();
const { submitFeedback } = require("../controllers/feedbackController");
const { authenticateToken } = require("../middleware/auth"); 

router.post("/appointments/:id/feedback", authenticateToken, submitFeedback);

module.exports = router;
