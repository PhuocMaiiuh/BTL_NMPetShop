const express = require('express');
const router = express.Router();
const { getOrders, getOrderById, updateOrderStatus, deleteOrder, getStats } = require('../controllers/orderController');

router.get('/stats', getStats);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
