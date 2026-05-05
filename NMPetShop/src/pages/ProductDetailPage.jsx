import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiLoader } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchProductById, fetchProducts } from '../services/productApi';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        
        // Fetch related products based on category
        const relatedData = await fetchProducts({
          category: '', // We use subCategories for exact match if possible, or just the same category name
          subCategories: [data.category],
          limit: 4
        });
        // Filter out the current product from related products
        setRelatedProducts(relatedData.products.filter(p => p.id !== data.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/dang-nhap');
      return;
    }
    addToCart(product, quantity);
  };

  const getCategoryInfo = (category) => {
    if (!category) return { label: 'Sản phẩm', path: '/san-pham' };
    const cat = category.toLowerCase();
    if (cat.includes('chó')) return { label: 'Sản phẩm cho chó', path: '/san-pham?category=cho' };
    if (cat.includes('mèo')) return { label: 'Sản phẩm cho mèo', path: '/san-pham?category=meo' };
    if (cat.includes('phụ kiện')) return { label: 'Phụ kiện', path: '/san-pham?category=phu-kien' };
    if (cat.includes('đồ chơi')) return { label: 'Đồ chơi', path: '/san-pham?category=do-choi' };
    if (cat.includes('chăm sóc') || cat.includes('sức khỏe')) return { label: 'Chăm sóc sức khỏe', path: '/san-pham?category=suc-khoe' };
    return { label: category, path: `/san-pham?category=all` };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <FiLoader size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-text-dark mb-4">Ối! Có lỗi xảy ra</h2>
        <p className="text-text-gray mb-8">{error || 'Không tìm thấy sản phẩm'}</p>
        <Link to="/san-pham" className="px-6 py-3 bg-primary text-white font-semibold rounded-lg">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(product.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <Link to={categoryInfo.path} className="hover:text-primary">{categoryInfo.label}</Link>
        <span>/</span>
        <span className="text-text-dark font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="bg-bg-gray rounded-2xl overflow-hidden mb-4 aspect-square">
            <img 
              src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image} 
              alt={product.name} 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {(product.images || [product.image]).map((img, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedImage(i)} 
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-medium">{product.category}</span>
          <h1 className="text-2xl font-bold text-text-dark mt-3 mb-3 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} size={14} className={i < Math.floor(product.rating || 4) ? 'text-secondary' : 'text-gray-200'} />
              ))}
            </div>
            <span className="text-sm text-text-gray">({product.reviews || 0} đánh giá)</span>
            <span className={`text-sm font-medium ${product.inStock ? 'text-accent-green' : 'text-accent'}`}>
              {product.inStock ? `Còn ${product.stockCount || product.stock || 0} sản phẩm` : 'Hết hàng'}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-lg text-text-light line-through">{formatPrice(product.originalPrice)}</span>}
          </div>

          <div className="text-sm text-text-gray leading-relaxed mb-6 whitespace-pre-line">
            {product.description}
          </div>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.specifications.map((spec, index) => (
                <div key={index} className="bg-bg-gray rounded-lg p-3">
                  <p className="text-xs text-text-light">{spec.label}</p>
                  <p className="text-sm font-medium text-text-dark">{spec.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-border rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                className="p-3 hover:bg-bg-gray transition-colors"
                disabled={!product.inStock}
              >
                <FiMinus size={16} />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stockCount || product.stock || 10, quantity + 1))} 
                className="p-3 hover:bg-bg-gray transition-colors"
                disabled={!product.inStock}
              >
                <FiPlus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-lg transition-colors ${
                product.inStock 
                  ? 'bg-primary hover:bg-primary-light text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart size={18} /> {product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            </button>
            <button className="p-3 border border-border rounded-lg hover:border-accent hover:text-accent transition-colors">
              <FiHeart size={18} />
            </button>
          </div>
          
          <div className="border-t border-border pt-6 mt-6">
             <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-text-light uppercase font-bold mb-1">Thương hiệu</p>
                  <p className="text-sm font-medium text-primary">{product.brand || 'NMPetShop'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-light uppercase font-bold mb-1">SKU</p>
                  <p className="text-sm font-medium text-text-dark">NM-{product.id}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border pt-16">
          <h2 className="text-xl font-bold text-text-dark mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
