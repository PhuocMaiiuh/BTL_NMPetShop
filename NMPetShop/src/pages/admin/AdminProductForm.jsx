import { useState, useEffect, useRef } from 'react';
import { FiUploadCloud, FiChevronRight, FiChevronDown, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { Link, useParams, useNavigate } from 'react-router-dom';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', category: '', price: 0, originalPrice: 0, description: '', stock: 0, image: ''
  });
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const savedProducts = JSON.parse(localStorage.getItem('nm_petshop_products') || '[]');
      const product = savedProducts.find(p => p.id === Number(id));
      if (product) {
        setFormData({
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice || product.price + 100000,
          description: product.description || 'Mô tả sản phẩm đang được cập nhật...',
          stock: product.stock,
          image: product.image
        });
      }
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const savedProducts = JSON.parse(localStorage.getItem('nm_petshop_products') || '[]');
      
      if (isEdit) {
        const updatedProducts = savedProducts.map(p => 
          p.id === Number(id) ? { ...p, ...formData, active: true } : p
        );
        localStorage.setItem('nm_petshop_products', JSON.stringify(updatedProducts));
      } else {
        const newProduct = {
          ...formData,
          id: savedProducts.length > 0 ? Math.max(...savedProducts.map(p => p.id)) + 1 : 1,
          active: true
        };
        localStorage.setItem('nm_petshop_products', JSON.stringify([...savedProducts, newProduct]));
      }

      setIsSaving(false);
      alert(isEdit ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!');
      navigate('/admin/san-pham');
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto py-2 px-4">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs text-text-gray mb-1">
            <Link to="/admin/san-pham" className="hover:text-primary">Sản phẩm</Link>
            <FiChevronRight size={12} />
            <span className="font-medium text-text-dark">{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}</span>
          </nav>
          <h1 className="text-3xl font-bold text-[#1e293b]">{isEdit ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm'}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/san-pham')}
            className="px-6 py-2 text-sm font-semibold text-[#64748b] bg-white border border-[#e2e8f0] rounded-full hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`px-6 py-2 text-sm font-semibold text-white bg-[#92400e] rounded-full hover:bg-[#78350f] transition-all shadow-sm flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang lưu...
              </>
            ) : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* General Info Section */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9]">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6">Thông tin chung</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-2">Tên sản phẩm *</label>
                <input 
                  type="text"
                  name="name"
                  placeholder="Nhập tên sản phẩm..."
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-2">Mô tả chi tiết</label>
                <textarea 
                  name="description"
                  rows={6}
                  placeholder="Mô tả về đặc điểm, công dụng, thành phần..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock Section */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9]">
            <h2 className="text-xl font-bold text-[#1e293b] mb-6">Giá & Tồn kho</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-2">Giá gốc (VNĐ) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] text-sm font-medium">đ</span>
                  <input 
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full pl-8 pr-5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-2">Giá giảm (VNĐ)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] text-sm font-medium">đ</span>
                  <input 
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-8 pr-5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#334155] mb-2">Số lượng tồn kho *</label>
                <input 
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-[#334155] mb-2">Danh mục *</label>
                <div 
                  className="w-full px-5 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer flex items-center justify-between"
                  onClick={() => setShowCatDropdown(!showCatDropdown)}
                >
                  <span className={formData.category ? 'text-[#1e293b]' : 'text-[#94a3b8]'}>
                    {formData.category || 'Chọn danh mục'}
                  </span>
                  <FiChevronDown size={16} className={`text-[#64748b] transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} />
                </div>

                {showCatDropdown && (
                  <div className="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-[#f1f5f9] py-3 z-[100]">
                    {[
                      { 
                        label: 'Sản phẩm cho Chó', 
                        subs: ['Thức ăn hạt', 'Pate & Đồ hộp', 'Sữa tắm & Vệ sinh'] 
                      },
                      { 
                        label: 'Sản phẩm cho Mèo', 
                        subs: ['Thức ăn hạt', 'Pate & Đồ hộp', 'Sữa tắm & Vệ sinh'] 
                      },
                      { 
                        label: 'Phụ kiện', 
                        subs: ['Phụ kiện cho chó', 'Phụ kiện cho mèo', 'Vòng cổ & Dây dắt', 'Bát ăn & Bình nước', 'Giường nệm & Chuồng'] 
                      },
                      { 
                        label: 'Đồ chơi', 
                        subs: ['Đồ chơi cho chó', 'Đồ chơi cho mèo', 'Đồ chơi nhai gặm', 'Cần câu & Bóng', 'Bàn cào móng'] 
                      },
                      { 
                        label: 'Chăm sóc sức khỏe', 
                        subs: ['Chăm sóc cho chó', 'Chăm sóc cho mèo', 'Thuốc & Vitamin', 'Dụng cụ cắt tỉa'] 
                      },
                    ].map((cat) => (
                      <div key={cat.label} className="relative group/cat px-2">
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-[#f8fafc] hover:text-primary transition-colors cursor-default text-sm font-medium text-[#475569]">
                          {cat.label}
                          <FiChevronRight size={14} className="text-[#94a3b8]" />
                        </div>
                        
                        {/* Submenu Pop-out (Final selection) */}
                        <div className="absolute left-[98%] top-0 min-w-[200px] bg-white rounded-2xl shadow-xl border border-[#f1f5f9] py-3 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-[110]">
                          {cat.subs.map((sub) => (
                            <div 
                              key={sub}
                              onClick={() => {
                                setFormData({ ...formData, category: `${sub} (${cat.label})` });
                                setShowCatDropdown(false);
                              }}
                              className="px-6 py-2 text-sm text-[#64748b] hover:text-primary hover:bg-[#f8fafc] cursor-pointer transition-colors"
                            >
                              {sub}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f1f5f9] h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1e293b]">Hình ảnh</h2>
              <span className="text-[10px] font-medium text-[#94a3b8]">Tối đa 5 ảnh</span>
            </div>
            
            <div 
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-[#e2e8f0] rounded-2xl p-4 h-[400px] flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors cursor-pointer bg-[#f8fafc]/50 relative overflow-hidden"
            >
              {formData.image ? (
                <div className="relative w-full h-full group/img">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <FiRefreshCw size={24} className="text-white" />
                    <p className="text-white text-xs font-bold">Nhấn để thay đổi hình ảnh</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData({ ...formData, image: '' });
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-danger hover:text-white text-danger rounded-full shadow-lg transition-all transform scale-0 group-hover/img:scale-100"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#eff6ff] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FiUploadCloud size={24} className="text-[#3b82f6]" />
                  </div>
                  <p className="text-sm font-bold text-[#334155] mb-1">Kéo thả hình ảnh vào đây</p>
                  <p className="text-xs text-[#64748b] mb-6">hoặc</p>
                  <div className="px-6 py-2 bg-[#eff6ff] text-[#3b82f6] text-xs font-bold rounded-lg hover:bg-[#dbeafe] transition-colors mb-6">
                    Chọn từ máy tính
                  </div>
                  <p className="text-[10px] text-[#94a3b8]">JPG, PNG, GIF tối đa 5MB</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
