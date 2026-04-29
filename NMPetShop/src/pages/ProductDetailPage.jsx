import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const product = {
  id: 1,
  name: 'Hạt Khô Cao Cấp Royal Canin cho chó trưởng thành',
  image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop',
  ],
  price: 850000,
  originalPrice: 950000,
  rating: 4.5,
  reviews: 24,
  category: 'Thức ăn cho chó',
  description: 'Thức ăn hạt khô cao cấp dành cho chó trưởng thành, được sản xuất từ nguyên liệu tự nhiên, giàu dinh dưỡng, hỗ trợ hệ tiêu hóa và bộ lông khỏe mạnh.',
  specifications: [
    { label: 'Thương hiệu', value: 'Royal Canin' },
    { label: 'Trọng lượng', value: '2kg' },
    { label: 'Xuất xứ', value: 'Pháp' },
    { label: 'Đối tượng', value: 'Chó trưởng thành' },
  ],
  inStock: true,
  stockCount: 24,
};

const relatedProducts = [
  { id: 2, name: 'Thức ăn ướt cho mèo', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', price: 320000, rating: 5, reviews: 12, category: 'Thức ăn cho mèo' },
  { id: 3, name: 'Pate cho chó con', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop', price: 382500, originalPrice: 450000, rating: 4, reviews: 6, category: 'Thức ăn', badge: 'Sale' },
  { id: 4, name: 'Thức ăn hạt tự nhiên', image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=400&h=400&fit=crop', price: 180000, rating: 5, reviews: 15, category: 'Phụ kiện' },
  { id: 5, name: 'Vòng cổ da cao cấp', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop', price: 250000, rating: 4, reviews: 9, category: 'Phụ kiện' },
];

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/dang-nhap');
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <Link to="/san-pham" className="hover:text-primary">Sản phẩm</Link>
        <span>/</span>
        <span className="text-text-dark font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="bg-bg-gray rounded-2xl overflow-hidden mb-4 aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">{product.category}</span>
          <h1 className="text-2xl font-bold text-text-dark mt-3 mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <FaStar key={i} size={14} className={i < Math.floor(product.rating) ? 'text-secondary' : 'text-gray-200'} />)}
            </div>
            <span className="text-sm text-text-gray">({product.reviews} đánh giá)</span>
            <span className={`text-sm font-medium ${product.inStock ? 'text-accent-green' : 'text-accent'}`}>
              {product.inStock ? `Còn ${product.stockCount} sản phẩm` : 'Hết hàng'}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-lg text-text-light line-through">{formatPrice(product.originalPrice)}</span>}
          </div>

          <p className="text-sm text-text-gray leading-relaxed mb-6">{product.description}</p>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="bg-bg-gray rounded-lg p-3">
                <p className="text-xs text-text-light">{spec.label}</p>
                <p className="text-sm font-medium text-text-dark">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Quantity + Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-bg-gray transition-colors"><FiMinus size={16} /></button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-bg-gray transition-colors"><FiPlus size={16} /></button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors"
            >
              <FiShoppingCart size={18} /> Thêm vào giỏ hàng
            </button>
            <button className="p-3 border border-border rounded-lg hover:border-accent hover:text-accent transition-colors">
              <FiHeart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section>
        <h2 className="text-xl font-bold text-text-dark mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
