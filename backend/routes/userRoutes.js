const express = require('express');
const router = express.Router();
const { getUsers, toggleUserStatus, deleteUser, loginUser } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/login', loginUser);
router.patch('/:id/status', toggleUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;
