const db = require("../config/db");

exports.createAppointment = async (req, res) => {
  const { professional_id, date, time, service, duration, price, notes } =
    req.body;
  const user_id = req.user.id;

  try {
    const [existing] = await db.query(
      `SELECT * FROM appointments WHERE professional_id = ? AND date = ? AND time = ? AND status IN ('scheduled', 'booked')`,
      [professional_id, date, time]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Time slot already booked." });
    }

    await db.query(
      `INSERT INTO appointments (user_id, professional_id, date, time, service, duration, price, notes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'booked')`,
      [user_id, professional_id, date, time, service, duration, price, notes]
    );

    res
      .status(201)
      .json({ success: true, message: "Appointment booked successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Database error", error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const [appointmentsRaw] = await db.query(
      `
      SELECT 
        a.id, a.date, a.time, a.status, a.service, a.duration, a.price, a.notes,

        -- User (who booked)
        u.id AS user_id, u.name AS user_name, u.email AS user_email, u.role AS user_role,

        -- Professional (who gives service)
        p.id AS professional_id, p.name AS professional_name, p.email AS professional_email, p.role AS professional_role,

        -- Organization
        o.id AS org_id, o.name AS org_name, o.description AS org_description, o.established_date AS org_established

      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN users p ON a.professional_id = p.id
      LEFT JOIN organizations o ON p.organization_id = o.id
      WHERE a.user_id = ? OR a.professional_id = ?
      `,
      [req.user.id, req.user.id]
    );

    const appointments = appointmentsRaw.map((a) => ({
      id: a.id,
      date: a.date,
      time: a.time,
      status: a.status,
      service: a.service,
      duration: a.duration,
      price: a.price,
      notes: a.notes,
      user: {
        id: a.user_id,
        name: a.user_name,
        email: a.user_email,
        role: a.user_role,
      },
      professional: {
        id: a.professional_id,
        name: a.professional_name,
        email: a.professional_email,
        role: a.professional_role,
        organization: a.org_id
          ? {
              id: a.org_id,
              name: a.org_name,
              description: a.org_description,
              established_date: a.org_established,
            }
          : null,
      },
    }));

    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: err.message,
    });
  }
};

exports.getAppointmentById = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        a.id, a.date, a.time, a.status, a.service, a.duration, a.price, a.notes,
        a.pending_date, a.pending_time,

        -- User (customer)
        u.id AS user_id, u.name AS user_name, u.email AS user_email, u.role AS user_role,

        -- Professional (barber/doctor)
        p.id AS professional_id, p.name AS professional_name, p.email AS professional_email, p.role AS professional_role,

        -- Organization
        o.id AS org_id, o.name AS org_name, o.description AS org_description, o.established_date AS org_established

      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN users p ON a.professional_id = p.id
      LEFT JOIN organizations o ON p.organization_id = o.id
      WHERE a.id = ? AND (a.user_id = ? OR a.professional_id = ?)
      `,
      [appointmentId, req.user.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or access denied",
      });
    }

    const a = rows[0];

    const appointment = {
      id: a.id,
      date: a.date,
      time: a.time,
      status: a.status,
      pending_date: a.pending_date,
      pending_time: a.pending_time,
      service: a.service,
      duration: a.duration,
      price: a.price,
      notes: a.notes,
      user: {
        id: a.user_id,
        name: a.user_name,
        email: a.user_email,
        role: a.user_role,
      },
      professional: {
        id: a.professional_id,
        name: a.professional_name,
        email: a.professional_email,
        role: a.professional_role,
        organization: a.org_id
          ? {
              id: a.org_id,
              name: a.org_name,
              description: a.org_description,
              established_date: a.org_established,
            }
          : null,
      },
    };

    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: err.message,
    });
  }
};


exports.rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  try {
    await db
      .promise()
      .query(
        `UPDATE appointments SET date = ?, time = ?, status = 'rescheduled' WHERE id = ? AND user_id = ?`,
        [date, time, id, req.user.id]
      );
    res.json({
      success: true,
      message: "Appointment rescheduled successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error rescheduling",
      error: err.message,
    });
  }
};

exports.cancelAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    await db
      .promise()
      .query(
        `UPDATE appointments SET status = 'cancelled' WHERE id = ? AND user_id = ?`,
        [id, req.user.id]
      );
    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error cancelling appointment",
      error: err.message,
    });
  }
};

exports.getMyClientAppointments = async (req, res) => {
  const user = req.user;

  if (!["doctor", "babar", "barber"].includes(user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only professionals can view this.",
    });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        a.id, a.date, a.time, a.status, a.service, a.duration, a.price, a.notes,

        -- Client
        u.id AS user_id, u.name AS user_name, u.email AS user_email, u.role AS user_role, u.is_verified,

        -- Professional
        p.id AS prof_id, p.name AS prof_name, p.email AS prof_email, p.role AS prof_role,

        -- Organization
        o.id AS org_id, o.name AS org_name, o.description AS org_description, o.established_date AS org_established

      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN users p ON a.professional_id = p.id
      LEFT JOIN organizations o ON p.organization_id = o.id
      WHERE a.professional_id = ?
      `,
      [user.id]
    );

    const formatted = rows.map((row) => ({
      appointment_id: row.id,
      date: row.date,
      time: row.time,
      status: row.status,
      service: row.service,
      duration: row.duration,
      price: row.price,
      notes: row.notes,
      client: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        role: row.user_role,
        is_verified: !!row.is_verified,
      },
      professional: {
        id: row.prof_id,
        name: row.prof_name,
        email: row.prof_email,
        role: row.prof_role,
        organization: row.org_id
          ? {
              id: row.org_id,
              name: row.org_name,
              description: row.org_description,
              established_date: row.org_established,
            }
          : null,
      },
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      appointments: formatted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: err.message,
    });
  }
};

// Step 1: User requests reschedule (pending)
exports.requestReschedule = async (req, res) => {
  const appointmentId = req.params.id;
  const { date, time } = req.body;
  const userId = req.user.id;

  try {
    const [rows] = await db.query(`SELECT * FROM appointments WHERE id = ?`, [
      appointmentId,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const appointment = rows[0];

    if (appointment.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to reschedule this appointment",
      });
    }

    await db.query(
      `UPDATE appointments 
       SET pending_date = ?, pending_time = ?, status = 'pending_reschedule' 
       WHERE id = ?`,
      [date, time, appointmentId]
    );

    res.status(200).json({
      success: true,
      message: "Reschedule request sent",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error processing reschedule request",
      error: err.message,
    });
  }
};

// Step 2: Doctor/Babar approves reschedule
exports.approveReschedule = async (req, res) => {
  const { id } = req.params;

  if (!["doctor", "barber"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Only professionals can approve reschedules",
    });
  }

  try {
    const [result] = await db.query(
      `UPDATE appointments 
       SET date = pending_date, time = pending_time, pending_date = NULL, pending_time = NULL, status = 'rescheduled' 
       WHERE id = ? AND professional_id = ?`,
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to approve this reschedule",
      });
    }

    res.json({
      success: true,
      message: "Reschedule approved and applied.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to approve reschedule",
      error: err.message,
    });
  }
};

// Step 3: Doctor/Babar rejects reschedule
exports.rejectReschedule = async (req, res) => {
  const appointmentId = req.params.id;
  const professionalId = req.user.id;

  try {
    const [result] = await db.query(
      `UPDATE appointments 
       SET pending_date = NULL, pending_time = NULL, status = 'booked'
       WHERE id = ? AND professional_id = ? AND status = 'pending_reschedule'`,
      [appointmentId, professionalId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reschedule request rejected",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error rejecting reschedule request",
      error: err.message,
    });
  }
};
