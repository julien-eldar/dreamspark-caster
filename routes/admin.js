// reality-show-caster/routes/admin.js
const express = require('express');
const User = require('../models/user'); // Adjust path if needed

const router = express.Router();

// --- GET /admin/users - List all users (Example admin action) ---
router.get('/users', async (req, res) => {
  try {
    // Exclude password hash from the result for security
    const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// --- DELETE /admin/users/:userId - Delete a user ---
router.delete('/users/:userId', async (req, res) => {
  const userIdToDelete = req.params.userId;
  const requestingAdminId = req.user.id; // ID of the admin making the request

  // Prevent admin from deleting themselves (optional safeguard)
  if (userIdToDelete == requestingAdminId) {
      return res.status(400).json({ error: 'Admin cannot delete their own account' });
  }

  try {
    const user = await User.findByPk(userIdToDelete);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    console.log(`Admin ${requestingAdminId} deleted user ${userIdToDelete}`);
    res.status(200).json({ message: 'User deleted successfully' }); // Use 200 or 204

  } catch (error) {
    console.error(`Error deleting user ${userIdToDelete}:`, error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;