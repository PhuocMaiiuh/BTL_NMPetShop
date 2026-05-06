const express = require('express');
const router = express.Router();
const { getPromotions, createPromotion, updatePromotion, deletePromotion, validatePromotion } = require('../controllers/promotionController');

router.get('/', getPromotions);
router.post('/', createPromotion);
router.post('/validate', validatePromotion);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

module.exports = router;
