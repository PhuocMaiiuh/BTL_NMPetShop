const express = require('express');
const router = express.Router();
const { getUsers, toggleUserStatus, deleteUser, loginUser, registerUser, updateProfile } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.put('/profile/:id', updateProfile);
router.patch('/:id/status', toggleUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
