const Product = require('../models/Product');

// Keyword map: URL param → Vietnamese keyword
const CATEGORY_KEYWORDS = {
  cho:        'chó',
  meo:        'mèo',
  'phu-kien': 'phụ kiện',
  'do-choi':  'đồ chơi',
  'suc-khoe': 'sức khỏe',
};

/**
 * Build MongoDB filter query from request query params
 */
const buildQuery = (reqQuery) => {
  const { category, filter, subCategories, brands, priceMin, priceMax, search, includeInactive } = reqQuery;
  const query = {};
  
  if (includeInactive !== 'true') {
    query.active = true;
  }

  // Full-text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }

  // Special filter: top-selling
  if (filter === 'top-selling') {
    query.isBestSelling = true;
  }

  // Category keyword or specific category
  if (category) {
    if (CATEGORY_KEYWORDS[category]) {
      const SUFFIX_MAP = {
        cho: '(Sản phẩm cho Chó)',
        meo: '(Sản phẩm cho Mèo)',
        'phu-kien': '(Phụ kiện)',
        'do-choi': '(Đồ chơi)',
        'suc-khoe': '(Chăm sóc sức khỏe)'
      };
      const suffix = SUFFIX_MAP[category];
      if (suffix) {
        query.category = { $regex: suffix.replace('(', '\\(').replace(')', '\\)'), $options: 'i' };
      }
    } else {
      // If not a keyword, it's a specific category from admin or direct filter
      query.category = { $regex: category, $options: 'i' };
    }
  }

  // Specific sub-categories
  if (subCategories) {
    const cats = subCategories.split(',').map(c => c.trim()).filter(Boolean);
    if (cats.length > 0) {
      query.category = { $in: cats };
      if (query.$or) delete query.$or; 
    }
  }

  // Brand filter
  if (brands) {
    const brandList = brands.split(',').map(b => b.trim()).filter(Boolean);
    if (brandList.length > 0) query.brand = { $in: brandList };
  }

  // Price range
  if (priceMin || priceMax) {
    query.price = {};
    if (priceMin) query.price.$gte = Number(priceMin);
    if (priceMax) query.price.$lte = Number(priceMax);
  }

  return query;
};

/**
 * Build sort object from sort param
 */
const buildSort = (sort) => {
  if (sort === 'price_asc')  return { price: 1 };
  if (sort === 'price_desc') return { price: -1 };
  if (sort === 'newest')     return { createdAt: -1 };
  if (sort === 'rating')     return { rating: -1 };
  return { id: 1 };
};

// ─────────────────────────────────────────────────────────────
// GET /api/products
// ─────────────────────────────────────────────────────────────
const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort } = req.query;
    const query   = buildQuery(req.query);
    const sortObj = buildSort(sort);
    const isTopSelling = req.query.filter === 'top-selling';
    const effectiveLimit = isTopSelling ? 10 : Number(limit);
    const skip = (Number(page) - 1) * Number(limit);
    const effectiveSkip = isTopSelling ? 0 : skip;

    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sortObj).skip(effectiveSkip).limit(effectiveLimit).lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      total: isTopSelling ? Math.min(10, totalCount) : totalCount,
      page: isTopSelling ? 1 : Number(page),
      totalPages: isTopSelling ? 1 : Math.ceil(totalCount / effectiveLimit),
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/products/meta
// ─────────────────────────────────────────────────────────────
const getProductMeta = async (req, res, next) => {
  try {
    const query = buildQuery(req.query);

    const [categories, brands] = await Promise.all([
      Product.distinct('category', query),
      Product.distinct('brand',    query),
    ]);

    res.json({
      categories: categories.filter(Boolean).sort(),
      brands:     brands.filter(Boolean).sort(),
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/products/:id
// ─────────────────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) }).lean();
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/products
// ─────────────────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    // Auto-increment id
    const last = await Product.findOne().sort({ id: -1 }).select('id').lean();
    const newId = last ? last.id + 1 : 1;

    const product = await Product.create({ ...req.body, id: newId });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/products/:id
// ─────────────────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndUpdate(
      { id: Number(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/products/:id/status
// ─────────────────────────────────────────────────────────────
const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    product.active = !product.active;
    await product.save();
    res.json({ id: product.id, active: product.active });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/products/:id
// ─────────────────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ id: Number(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
    }
    res.json({ message: 'Xóa sản phẩm thành công', id: Number(req.params.id) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductMeta,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
};
