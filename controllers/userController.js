const User = require("../models/User");

// ✅ Get All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  console.log("GET ALL USERS API HIT");
  try {
    const users = await User.getAllUsers();
    console.log("Users fetched:", users);
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

// ✅ Get user by ID (admin can get anyone, others only themselves)
exports.getUserById = async (req, res) => {
  const loggedInUser = req.user;
  const targetUserId = parseInt(req.params.id);

  if (loggedInUser.role !== "admin" && loggedInUser.id !== targetUserId) {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  try {
    const user = await User.findById(targetUserId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: err.message,
    });
  }
};

// ✅ Update user (admin can update anyone, others only themselves, and cannot change role)
exports.updateUser = async (req, res) => {
  const { name, role } = req.body;
  const loggedInUser = req.user;
  const targetUserId = parseInt(req.params.id);

  // Access check
  if (loggedInUser.role !== "admin" && loggedInUser.id !== targetUserId) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to update this user.",
    });
  }

  const updateData = { name };

  // Only admin can change role
  if (loggedInUser.role === "admin" && role) {
    updateData.role = role;
  }

  try {
    const result = await new Promise((resolve, reject) => {
      User.updateUserDetails(targetUserId, updateData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
};

// ✅ Delete user (admin can delete anyone, user can delete themselves only)
exports.deleteUser = async (req, res) => {
  const loggedInUser = req.user;
  const targetUserId = parseInt(req.params.id);

  if (loggedInUser.role !== "admin" && loggedInUser.id !== targetUserId) {
    return res
      .status(403)
      .json({
        success: false,
        message: "You are not allowed to delete this user.",
      });
  }

  try {
    await new Promise((resolve, reject) => {
      User.deleteUser(targetUserId, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: err.message,
    });
  }
};
