// reality-show-caster/middleware/isAdmin.js
function isAdmin(req, res, next) {
    // Assumes authenticateToken has run and attached user payload
    if (req.user && req.user.role === 'admin') {
      next(); // User is admin, proceed
    } else {
      res.status(403).json({ error: 'Forbidden: Requires admin privileges' });
    }
  }
  
  module.exports = isAdmin;