import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminProductForm = () => {
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', originalPrice: '', description: '', stock: '', weight: '', origin: '', brand: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Thêm sản phẩm mới</h1>
          <p className="text-sm text-text-gray mt-1">Điền thông tin để tạo sản phẩm mới</p>
        </div>
        <Link to="/admin/san-pham" className="text-sm text-text-gray hover:text-primary">← Quay lại</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text-dark mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Tên sản phẩm *</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="Nhập tên sản phẩm" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Danh mục *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary bg-white">
                    <option value="">Chọn danh mục</option>
                    <option>Thức ăn cho chó</option>
                    <option>Thức ăn cho mèo</option>
                    <option>Phụ kiện</option>
                    <option>Đồ chơi</option>
                    <option>Chăm sóc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1.5">Thương hiệu</label>
                  <input name="brand" value={formData.brand} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="Royal Canin" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Mô tả</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary resize-none" placeholder="Mô tả chi tiết sản phẩm..." />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text-dark mb-4">Giá & Kho hàng</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Giá bán *</label>
                <input name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="850,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Giá gốc</label>
                <input name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="950,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1.5">Số lượng tồn kho</label>
                <input name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="24" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-text-dark mb-4">Hình ảnh</h3>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <FiUpload size={32} className="text-text-light mx-auto mb-3" />
              <p className="text-sm text-text-gray">Kéo thả hoặc click để tải ảnh</p>
              <p className="text-xs text-text-light mt-1">PNG, JPG (tối đa 5MB)</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-border p-6">
            <button className="w-full py-3 bg-primary hover:bg-primary-light text-white font-semibold rounded-lg transition-colors mb-3">Lưu sản phẩm</button>
            <button className="w-full py-3 border border-border text-text-gray rounded-lg hover:bg-bg-gray transition-colors text-sm">Lưu nháp</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
