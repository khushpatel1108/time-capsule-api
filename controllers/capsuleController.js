const Capsule = require('./models/Capsule');
const moment = require('moment');

// Create Capsule
const createCapsule = async (req, res) => {
  const { message, unlock_at } = req.body;
  const userId = req.user.userId;

  if (!message || !unlock_at) {
    return res.status(400).send('Message and unlock time are required');
  }

  const unlockAt = moment(unlock_at).toISOString();
  if (!moment(unlockAt).isValid()) {
    return res.status(400).send('Invalid unlock time');
  }

  try {
    const capsule = await Capsule.create({ message, unlock_at: unlockAt, user_id: userId });
    res.status(201).send({
      id: capsule.id,
      unlock_code: capsule.unlock_code,
    });
  } catch (error) {
    res.status(500).send('Error creating capsule');
  }
};

// Retrieve Capsule
const retrieveCapsule = async (req, res) => {
  const { id } = req.params;
  const { code } = req.query;

  try {
    const capsule = await Capsule.findOne({ where: { id, user_id: req.user.userId } });
    if (!capsule) {
      return res.status(404).send('Capsule not found');
    }

    const unlockAt = moment(capsule.unlock_at);
    const currentTime = moment();

    if (currentTime.isBefore(unlockAt)) {
      return res.status(403).send('Capsule is locked');
    }

    if (!code || capsule.unlock_code !== code) {
      return res.status(401).send('Invalid unlock code');
    }

    if (currentTime.isAfter(unlockAt.add(30, 'days'))) {
      return res.status(410).send('Capsule has expired');
    }

    if (capsule.is_expired) {
      return res.status(410).send('Capsule has expired');
    }

    res.status(200).send(capsule);
  } catch (error) {
    res.status(500).send('Error retrieving capsule');
  }
};

// List User Capsules (With Pagination)
const listCapsules = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const capsules = await Capsule.findAndCountAll({
      where: { user_id: req.user.userId },
      limit: Number(limit),
      offset: offset,
      attributes: {
        exclude: ['message'], // Exclude message if locked
      },
    });

    res.status(200).send({
      data: capsules.rows,
      total: capsules.count,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).send('Error fetching capsules');
  }
};

// Update Capsule
const updateCapsule = async (req, res) => {
  const { id } = req.params;
  const { code } = req.query;
  const { message, unlock_at } = req.body;

  try {
    const capsule = await Capsule.findOne({ where: { id, user_id: req.user.userId } });
    if (!capsule) {
      return res.status(404).send('Capsule not found');
    }

    if (!code || capsule.unlock_code !== code) {
      return res.status(401).send('Invalid unlock code');
    }

    const unlockAt = moment(capsule.unlock_at);
    const currentTime = moment();

    if (currentTime.isAfter(unlockAt)) {
      return res.status(403).send('Capsule is already unlocked or cannot be updated');
    }

    if (message) {
      capsule.message = message;
    }

    if (unlock_at) {
      capsule.unlock_at = moment(unlock_at).toISOString();
    }

    await capsule.save();
    res.status(200).send(capsule);
  } catch (error) {
    res.status(500).send('Error updating capsule');
  }
};

// Delete Capsule
const deleteCapsule = async (req, res) => {
  const { id } = req.params;
  const { code } = req.query;

  try {
    const capsule = await Capsule.findOne({ where: { id, user_id: req.user.userId } });
    if (!capsule) {
      return res.status(404).send('Capsule not found');
    }

    if (!code || capsule.unlock_code !== code) {
      return res.status(401).send('Invalid unlock code');
    }

    const unlockAt = moment(capsule.unlock_at);
    const currentTime = moment();

    if (currentTime.isAfter(unlockAt)) {
      return res.status(403).send('Capsule cannot be deleted after unlock time');
    }

    await capsule.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Error deleting capsule');
  }
};

module.exports = { createCapsule, retrieveCapsule, listCapsules, updateCapsule, deleteCapsule };
