// reality-show-caster/models/user.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // ---- ADD THIS ----
  role: {
    type: Sequelize.STRING,
    defaultValue: 'user', // Default role for new signups
    allowNull: false,
  }
  // ------------------
});

module.exports = User;