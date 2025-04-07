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
});

module.exports = User;