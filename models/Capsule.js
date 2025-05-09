const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const moment = require('moment');
const generateUnlockCode = require('../utils/generateUnlockCode');

const Capsule = sequelize.define('Capsule', {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unlock_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  unlock_code: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => generateUnlockCode(), // Generate unlock code
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
   is_expired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: true,
  paranoid: true, 
});

Capsule.beforeCreate((capsule) => {
  if (!moment(capsule.unlock_at).isValid()) {
    throw new Error('Invalid unlock_at date');
  }
});

module.exports = Capsule;
