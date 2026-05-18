const express = require('express');
const router  = express.Router();
const {
  getProducts,
  getProductMeta,
  getProductById,
  getTopSelling,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
} = require('../controllers/productController');

// NOTE: /meta and /top-selling must be declared BEFORE /:id to avoid conflict
router.get('/meta', getProductMeta);
router.get('/top-selling', getTopSelling);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.patch('/:id/status', toggleProductStatus);

module.exports = router;
