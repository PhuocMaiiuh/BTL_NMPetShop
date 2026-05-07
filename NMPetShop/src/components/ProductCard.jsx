import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    id,
    name,
    image,
    price,
    originalPrice,
    rating = 4,
    reviews = 0,
    category,
    badge,
  } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/dang-nhap');
      return;
    }
    addToCart(product);
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat('vi-VN').format(p) + 'đ';
  };

  return (
    <div
      className="group rounded-3xl overflow-hidden border transition-all duration-300"
      style={{
        background: '#ffffff',
        borderColor: 'rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.1), 0 0 30px rgba(232,90,43,0.1)';
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(232,90,43,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square" style={{ background: '#f8fafc' }}>
        <Link to={`/san-pham/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
        </Link>
        {badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
            badge === 'Sale' ? 'bg-accent' : 'bg-accent-green'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{category}</p>
        <Link to={`/san-pham/${id}`}>
          <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-[#e85a2b] transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={11}
              className={i < rating ? 'text-amber-400' : 'text-gray-200'}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({reviews})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-black text-[#e85a2b]">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
            style={{
              background: 'linear-gradient(135deg, #e85a2b, #f59e0b)',
              boxShadow: '0 4px 12px rgba(232,90,43,0.35)',
            }}
          >
            <FiShoppingCart size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
