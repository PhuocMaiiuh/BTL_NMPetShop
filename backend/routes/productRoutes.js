const express = require('express');
const router  = express.Router();
const {
  getProducts,
  getProductMeta,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
} = require('../controllers/productController');

// NOTE: /meta must be declared BEFORE /:id to avoid conflict
router.get('/meta', getProductMeta);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.patch('/:id/status', toggleProductStatus);

module.exports = router;
