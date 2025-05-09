const express = require('express');
const router = express.Router();
const { createCapsule, retrieveCapsule, listCapsules, updateCapsule, deleteCapsule } = require('../controllers/capsuleController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/capsules', authMiddleware, createCapsule);
router.get('/capsules/:id', authMiddleware, retrieveCapsule);
router.get('/capsules', authMiddleware, listCapsules);
router.put('/capsules/:id', authMiddleware, updateCapsule);
router.delete('/capsules/:id', authMiddleware, deleteCapsule);

module.exports = router;
