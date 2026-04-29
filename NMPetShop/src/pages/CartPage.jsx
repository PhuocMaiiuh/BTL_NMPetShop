import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();

  const shipping = 30000;
  const total = cartSubtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <span className="text-text-dark font-medium">Giỏ hàng</span>
      </nav>

      <h1 className="text-2xl font-bold text-text-dark mb-8">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-gray mb-4">Giỏ hàng trống</p>
          <Link to="/san-pham" className="px-6 py-3 bg-primary text-white rounded-lg font-medium">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-bg-gray text-xs font-semibold text-text-gray uppercase">
                <div className="col-span-5">Sản phẩm</div>
                <div className="col-span-2 text-center">Giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-center">Tổng</div>
                <div className="col-span-1"></div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-border last:border-0 hover:bg-bg-gray/50 transition-colors">
                  <div className="col-span-5 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-text-dark">{item.name}</p>
                      <p className="text-xs text-text-light">{item.category}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm font-medium">{formatPrice(item.price)}</div>
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:bg-bg-gray"><FiMinus size={14} /></button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:bg-bg-gray"><FiPlus size={14} /></button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</div>
                  <div className="col-span-1 text-center">
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-text-light hover:text-accent transition-colors"><FiTrash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-semibold text-text-dark mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-text-gray">Tạm tính</span><span className="font-medium">{formatPrice(cartSubtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-gray">Phí vận chuyển</span><span className="font-medium">{formatPrice(shipping)}</span></div>
                <div className="border-t border-border pt-3 flex justify-between"><span className="font-semibold">Tổng cộng</span><span className="text-lg font-bold text-primary">{formatPrice(total)}</span></div>
              </div>
              <Link to="/thanh-toan" className="block w-full py-3 bg-primary hover:bg-primary-light text-white text-center font-semibold rounded-lg transition-colors">
                Tiến hành thanh toán
              </Link>
              <Link to="/san-pham" className="block w-full py-3 mt-3 text-center text-sm text-primary hover:text-primary-light font-medium">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
