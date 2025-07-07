const db = require("../config/db");

const Appointment = {
  // Create a new appointment
  create: (data, cb) => db.query("INSERT INTO appointments SET ?", data, cb),

  // Get appointments by user (customer)
  getByUser: (userId, cb) =>
    db.query("SELECT * FROM appointments WHERE user_id = ?", [userId], cb),

  // Get appointments by professional (doctor/barber)
  getByProfessional: (id, cb) =>
    db.query("SELECT * FROM appointments WHERE professional_id = ?", [id], cb),

  // Cancel appointment
  cancel: (id, cb) =>
    db.query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      ["cancelled", id],
      cb
    ),

  // Check if a time slot is available
  isAvailable: (professional_id, date, time, cb) => {
    db.query(
      "SELECT * FROM appointments WHERE professional_id = ? AND date = ? AND time = ? AND status = ? LIMIT 1",
      [professional_id, date, time, "booked"],
      (err, results) => cb(err, results.length === 0)
    );
  },

  // ✅ Request reschedule (by customer)
  requestReschedule: (appointmentId, userId, date, time, cb) => {
    db.query(
      `UPDATE appointments 
       SET pending_date = ?, pending_time = ?, status = 'pending_reschedule' 
       WHERE id = ? AND user_id = ?`,
      [date, time, appointmentId, userId],
      cb
    );
  },

  // ✅ Approve reschedule (by professional)
  approveReschedule: (appointmentId, professionalId, cb) => {
    db.query(
      `UPDATE appointments 
       SET date = pending_date, time = pending_time, 
           pending_date = NULL, pending_time = NULL, 
           status = 'rescheduled' 
       WHERE id = ? AND professional_id = ?`,
      [appointmentId, professionalId],
      cb
    );
  },

  // ✅ Reject reschedule (by professional)
  rejectReschedule: (appointmentId, professionalId, cb) => {
    db.query(
      `UPDATE appointments 
       SET pending_date = NULL, pending_time = NULL, 
           status = 'booked' 
       WHERE id = ? AND professional_id = ?`,
      [appointmentId, professionalId],
      cb
    );
  },
};

module.exports = Appointment;
