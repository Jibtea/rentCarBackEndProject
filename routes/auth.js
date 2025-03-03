const express = require('express');

const { register, login, getMe, logout, update } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.put('/:id', protect, update);

module.exports = router;