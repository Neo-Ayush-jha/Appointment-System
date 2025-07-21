const db = require("../config/db");
const bcrypt = require("bcryptjs");

const User = {
  // Create a new user with hashed password
  create: async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
    const [result] = await db.query("INSERT INTO users SET ?", user);
    return result;
  },

  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT id, name, email, role, is_verified FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // Update verification
  updateVerification: async (email) => {
    await db.query("UPDATE users SET is_verified = TRUE WHERE email = ?", [
      email,
    ]);
  },

  // Update password
  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      id,
    ]);
  },

  // Get all users
  getAllUsers: async () => {
    const [rows] = await db.query(
      `SELECT 
      u.id,
      u.name,
      u.email,
      u.role,
      u.is_verified,
      u.created_at,
      u.organization_id,
      o.name AS organization_name,
      o.description AS organization_description,
      o.established_date,
      o.address AS organization_address,
      o.phone AS organization_phone,
      o.email AS organization_email
    FROM users u
    LEFT JOIN organizations o ON u.organization_id = o.id`
    );
    return rows;
  },

  // Update user
  updateUserDetails: async (id, updatedData) => {
    const [result] = await db.query("UPDATE users SET ? WHERE id = ?", [
      updatedData,
      id,
    ]);
    return result.affectedRows;
  },

  // Delete user
  deleteUser: async (id) => {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },

  // Filter users by role
  filterByRole: async (role) => {
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE role = ?",
      [role]
    );
    return rows;
  },

  // Search users by name
  searchByName: async (searchTerm) => {
    const likeTerm = `%${searchTerm}%`;
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE name LIKE ?",
      [likeTerm]
    );
    return rows;
  },

  // Paginated list of users
  getAllUsersPaginated: async (limit, offset) => {
    const [rows] = await db.query(
      "SELECT id, name, email, role, is_verified FROM users LIMIT ? OFFSET ?",
      [limit, offset]
    );
    return rows;
  },
};

module.exports = User;
