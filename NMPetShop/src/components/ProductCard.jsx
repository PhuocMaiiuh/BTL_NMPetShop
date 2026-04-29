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
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-bg-gray">
        <Link to={`/san-pham/${id}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        {badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white ${
            badge === 'Sale' ? 'bg-accent' : 'bg-accent-green'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-text-light mb-1">{category}</p>
        <Link to={`/san-pham/${id}`}>
          <h3 className="font-medium text-sm text-text-dark mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              size={12}
              className={i < rating ? 'text-secondary' : 'text-gray-200'}
            />
          ))}
          <span className="text-xs text-text-light ml-1">({reviews})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-primary">{formatPrice(price)}</span>
            {originalPrice && (
              <span className="text-xs text-text-light line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-8 h-8 bg-secondary hover:bg-secondary-light rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <FiShoppingCart size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
