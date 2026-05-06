const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  deleteOrder, 
  getStats, 
  getUserOrders,
  createOrder 
} = require('../controllers/orderController');

router.get('/stats', getStats);
router.get('/user/:userId', getUserOrders);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
