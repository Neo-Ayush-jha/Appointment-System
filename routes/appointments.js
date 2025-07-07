const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticateToken } = require("../middleware/auth");

// Middleware: Only logged-in users can access any route below
router.use(authenticateToken);

// Book new appointment
router.post("/", appointmentController.createAppointment);

// Get all appointments (for customer or professional)
router.get("/", appointmentController.getAppointments);

// Get single appointment by ID
router.get("/:id", appointmentController.getAppointmentById);

// Cancel appointment (by customer)
router.delete("/:id", appointmentController.cancelAppointment);

// Reschedule request (by customer)
router.post("/:id/reschedule-request", appointmentController.requestReschedule);

// Approve reschedule (by doctor/barber)
router.post("/:id/reschedule-approve", appointmentController.approveReschedule);

// Reject reschedule (by doctor/barber)
router.patch("/:id/reschedule-reject", appointmentController.rejectReschedule);

// View clients (for doctor/barber only)
router.get("/my/clients", appointmentController.getMyClientAppointments);

module.exports = router;
