require('dotenv').config();
const express = require('express');
const app = express();
const capsuleRoutes = require('./routes/capsuleRoutes');
const sequelize = require('./config/db');
const Capsule = require('../models/Capsule');
const expireOldCapsules = require('./tasks/expireCapsules');

app.use(express.json());
app.use(capsuleRoutes);

Capsule.sync({ alter: true })
  .then(() => {
    console.log('Capsule table updated');

    expireOldCapsules();

    setInterval(() => {
      expireOldCapsules();
    }, 12 * 60 * 60 * 1000);

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing Capsule model:', err);
  });
