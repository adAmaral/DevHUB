const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    getProfile,
    updateProfile,
    updatePassword,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/password', authMiddleware, updatePassword);

module.exports = router;
