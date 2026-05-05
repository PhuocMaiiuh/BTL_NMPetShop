import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const { addToast } = useToast();
  const [discountValue, setDiscountValue] = useState(0);
  const [itemToDelete, setItemToDelete] = useState(null);

  const shipping = 30000;
  const discountAmount = discountValue <= 1 ? cartSubtotal * discountValue : discountValue;
  const total = Math.max(0, cartSubtotal + shipping - discountAmount);

  const handleRemove = (item) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      addToast(`Đã xóa "${itemToDelete.name}" khỏi giỏ hàng`, 'info');
      setItemToDelete(null);
    }
  };

  const handleUpdateQty = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    if (newQty > 99) {
      addToast('Số lượng tối đa là 99 sản phẩm', 'warning');
      return;
    }
    updateQuantity(item.id, delta);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <Link to="/gio-hang" className="text-text-dark font-medium hover:text-primary">Giỏ hàng</Link>
      </nav>

      <h1 className="text-2xl font-bold text-text-dark mb-8">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-gray mb-4 text-lg">Giỏ hàng trống</p>
          <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors">Tiếp tục mua sắm</Link>
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
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover"/>
                    <div>
                      <p className="text-sm font-medium text-text-dark">{item.name}</p>
                      <p className="text-xs text-text-light">{item.category}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm font-medium">{formatPrice(item.price)}</div>
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => handleUpdateQty(item, -1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 hover:bg-bg-gray disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiMinus size={14}/>
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item, 1)}
                        disabled={item.quantity >= 99}
                        className="p-1.5 hover:bg-bg-gray disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiPlus size={14}/>
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</div>
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => handleRemove(item)}
                      className="p-2 text-text-light hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <FiTrash2 size={16}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1 h-fit">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24 shadow-sm">
              <h3 className="font-semibold text-text-dark mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm"><span className="text-text-gray">Tạm tính</span><span className="font-medium">{formatPrice(cartSubtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-gray">Phí vận chuyển</span><span className="font-medium">{formatPrice(shipping)}</span></div>
                <div className={`flex justify-between text-sm ${discountAmount > 0 ? 'text-green-600' : 'text-text-gray'}`}>
                  <span className="font-medium">Giảm giá</span>
                  <span className="font-medium">{discountAmount > 0 ? `-${formatPrice(discountAmount)}` : '0đ'}</span>
                </div>
                <div className="pt-1 pb-1">
                  <select
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm focus:border-primary outline-none appearance-none bg-white cursor-pointer text-text-dark"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                  >
                    <option value={0}>Chọn mã giảm giá...</option>
                    <option value={0.1}>Giảm 10% - Khách hàng mới</option>
                    <option value={0.15}>Giảm 15% - Mùa hè rực rỡ</option>
                    <option value={30000}>Freeship - Giảm 30K</option>
                  </select>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <Link
                to={cartItems.length > 0 ? '/thanh-toan' : '#'}
                className={`block w-full py-3 text-center font-semibold rounded-lg transition-colors ${cartItems.length > 0 ? 'bg-primary hover:bg-primary-light text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'}`}
              >
                Tiến hành thanh toán
              </Link>
              <Link to="/" className="block w-full py-3 mt-3 text-center text-sm text-primary hover:text-primary-light font-medium">
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 animate-scale-in">
            <h3 className="text-lg font-bold text-text-dark mb-2">Xác nhận xóa</h3>
            <p className="text-text-gray mb-6 leading-relaxed">
              Bạn có chắc muốn xóa <span className="font-semibold text-text-dark">"{itemToDelete.name}"</span> khỏi giỏ hàng?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-text-gray hover:bg-bg-gray rounded-lg transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CartPage;
