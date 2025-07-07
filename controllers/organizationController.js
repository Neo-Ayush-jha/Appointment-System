const db = require("../config/db");

exports.createOrganization = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Only admin can create organization" });
  }
  const { name, description, established_date, address, phone, email } = req.body;
  try {
    await db.query(
      `INSERT INTO organizations (name, description, established_date, address, phone, email)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, established_date, address, phone, email]
    );
    res.status(201).json({ success: true, message: "Organization created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating organization", error: err.message });
  }
};

exports.getOrganizations = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM organizations`);
    res.status(200).json({ success: true, organizations: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching organizations", error: err.message });
  }
};

exports.assignProfessionalToOrganization = async (req, res) => {
  const { userId, organizationId } = req.body;
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Only admin can assign professionals" });
  }
  try {
    await db.query(`UPDATE users SET organization_id = ? WHERE id = ? AND role IN ('doctor', 'barber')`, [organizationId, userId]);
    res.status(200).json({ success: true, message: "User assigned to organization" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to assign user", error: err.message });
  }
};