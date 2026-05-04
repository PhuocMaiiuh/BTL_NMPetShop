import { useState, useMemo, useRef, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiFilter, FiChevronDown, FiChevronRight, FiX, FiUploadCloud, FiRefreshCw } from 'react-icons/fi';

const defaultProducts = [
  { id: 1, name: 'Hạt Khô Cao Cấp', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=80&h=80&fit=crop', category: 'Thức ăn hạt (Sản phẩm cho Chó)', price: 850000, originalPrice: 950000, description: 'Sản phẩm thức ăn hạt cao cấp cho chó lớn.', stock: 24, active: true },
  { id: 2, name: 'Cần Câu Mèo', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=80&h=80&fit=crop', category: 'Cần câu & Bóng (Đồ chơi)', price: 45000, originalPrice: 60000, description: 'Đồ chơi cần câu giúp mèo vận động.', stock: 2, active: true },
  { id: 3, name: 'Đệm Ngủ Tròn', image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=80&h=80&fit=crop', category: 'Giường nệm & Chuồng (Phụ kiện)', price: 350000, originalPrice: 400000, description: 'Đệm ngủ êm ái cho thú cưng.', stock: 0, active: false },
  { id: 4, name: 'Vòng cổ LED phát sáng', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=80&h=80&fit=crop', category: 'Vòng cổ & Dây dắt (Phụ kiện)', price: 120000, originalPrice: 150000, description: 'Vòng cổ an toàn khi dắt thú cưng đi dạo ban đêm.', stock: 15, active: true },
  { id: 5, name: 'Sữa tắm thảo dược', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&h=80&fit=crop', category: 'Sữa tắm & Vệ sinh (Sản phẩm cho Mèo)', price: 195000, originalPrice: 220000, description: 'Sữa tắm an toàn, không kích ứng da.', stock: 8, active: true },
];

const categoryGroups = [
  { label: 'Sản phẩm cho Chó', subs: ['Thức ăn hạt', 'Pate & Đồ hộp', 'Sữa tắm & Vệ sinh'] },
  { label: 'Sản phẩm cho Mèo', subs: ['Thức ăn hạt', 'Pate & Đồ hộp', 'Sữa tắm & Vệ sinh'] },
  { label: 'Phụ kiện', subs: ['Phụ kiện cho chó', 'Phụ kiện cho mèo', 'Vòng cổ & Dây dắt', 'Bát ăn & Bình nước', 'Giường nệm & Chuồng'] },
  { label: 'Đồ chơi', subs: ['Đồ chơi cho chó', 'Đồ chơi cho mèo', 'Đồ chơi nhai gặm', 'Cần câu & Bóng', 'Bàn cào móng'] },
  { label: 'Chăm sóc sức khỏe', subs: ['Chăm sóc cho chó', 'Chăm sóc cho mèo', 'Thuốc & Vitamin', 'Dụng cụ cắt tỉa'] },
];

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const AdminProducts = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nm_petshop_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [showCatFilterDropdown, setShowCatFilterDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', price: 0, originalPrice: 0, description: '', stock: 0, image: ''
  });
  const [showFormCatDropdown, setShowFormCatDropdown] = useState(false);

  const catFilterRef = useRef(null);
  const statusFilterRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('nm_petshop_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catFilterRef.current && !catFilterRef.current.contains(event.target)) setShowCatFilterDropdown(false);
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) setShowStatusDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const lowStockCount = useMemo(() => products.filter(p => p.stock <= 10).length, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? p.active : !p.active);
      const matchesLowStock = !lowStockOnly || p.stock <= 10;
      return matchesSearch && matchesCategory && matchesStatus && matchesLowStock;
    });
  }, [search, categoryFilter, statusFilter, lowStockOnly, products]);

  const handleToggleStatus = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không? Thao tác này không thể hoàn tác.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', price: 0, originalPrice: 0, description: '', stock: 0, image: '' });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      description: p.description || '',
      stock: p.stock,
      image: p.image
    });
    setShowModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price <= 0 || formData.stock < 0) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm và giá hợp lệ!');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      if (editingId) {
        setProducts(prev => prev.map(p => 
          p.id === editingId ? { ...p, ...formData } : p
        ));
      } else {
        const newProduct = {
          ...formData,
          id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
          active: true
        };
        setProducts(prev => [newProduct, ...prev]);
      }
      
      setIsSaving(false);
      setShowModal(false);
      alert(editingId ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm mới thành công!');
    }, 800);
  };

  return (
    <div className="relative pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Sản phẩm</h1>
          <p className="text-sm text-text-gray mt-1">Quản lý kho hàng và danh mục sản phẩm của bạn.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white font-semibold rounded-xl shadow-lg shadow-secondary/20 transition-all text-sm"
        >
          <FiPlus size={16} /> Thêm sản phẩm mới
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 mb-6 h-12">
        <div className="flex-1 relative h-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full pl-10 pr-4 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-white"
            placeholder="Tìm kiếm tên sản phẩm..."
          />
        </div>

        <div className="relative flex-shrink-0 h-full" ref={catFilterRef}>
          <div
            className={`w-[240px] h-full px-4 border rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${categoryFilter !== 'All' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-[#e2e8f0] text-[#64748b] hover:border-primary'}`}
            onClick={() => setShowCatFilterDropdown(!showCatFilterDropdown)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FiFilter size={16} className="flex-shrink-0" />
              <span className="truncate">{categoryFilter === 'All' ? 'Tất cả danh mục' : categoryFilter}</span>
            </div>
            <FiChevronDown size={16} className={`flex-shrink-0 transition-transform ${showCatFilterDropdown ? 'rotate-180' : ''}`} />
          </div>
          {showCatFilterDropdown && (
            <div className="absolute left-0 mt-2 w-[280px] bg-white rounded-2xl shadow-xl border border-[#f1f5f9] py-3 z-[100] animate-fade-in">
              <div
                className="px-6 py-2.5 text-sm text-[#475569] hover:text-primary hover:bg-[#f8fafc] cursor-pointer transition-colors font-semibold border-b border-[#f1f5f9] mb-1"
                onClick={() => { setCategoryFilter('All'); setShowCatFilterDropdown(false); }}
              >
                Tất cả danh mục
              </div>
              {categoryGroups.map((cat) => (
                <div key={cat.label} className="relative group/cat px-2">
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-[#f8fafc] hover:text-primary transition-colors cursor-default text-sm font-medium text-[#475569]">
                    <span className="truncate">{cat.label}</span>
                    <FiChevronRight size={14} className="text-[#94a3b8] flex-shrink-0" />
                  </div>
                  <div className="absolute left-[98%] top-0 min-w-[220px] bg-white rounded-2xl shadow-xl border border-[#f1f5f9] py-3 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-[110]">
                    {cat.subs.map((sub) => (
                      <div
                        key={sub}
                        onClick={() => { setCategoryFilter(`${sub} (${cat.label})`); setShowCatFilterDropdown(false); }}
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

        <button
          onClick={() => setLowStockOnly(!lowStockOnly)}
          className={`h-full px-4 rounded-xl text-sm font-semibold transition-all w-[170px] flex-shrink-0 flex items-center justify-center gap-2 ${lowStockOnly ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-white text-[#64748b] border border-[#e2e8f0] hover:border-secondary hover:text-secondary'}`}
        >
          Sắp hết hàng ({lowStockCount})
        </button>

        {(search || categoryFilter !== 'All' || statusFilter !== 'All' || lowStockOnly) && (
          <button
            onClick={() => { setSearch(''); setCategoryFilter('All'); setStatusFilter('All'); setLowStockOnly(false); }}
            className="text-xs font-bold text-accent hover:text-accent-dark transition-colors px-2 whitespace-nowrap"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#f1f5f9] overflow-hidden shadow-sm min-h-[480px]">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-text-gray uppercase bg-bg-gray/50 border-b border-border">
              <th className="px-6 py-4">Sản phẩm</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4 text-right">Giá bán</th>
              <th className="px-6 py-4 text-center">Tồn kho</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-bg-gray/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-border bg-bg-gray flex-shrink-0 group-hover:scale-105 transition-transform">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-black text-text-dark line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-bold text-text-gray uppercase">{p.category}</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-primary">{formatPrice(p.price)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.stock <= 5 ? 'bg-danger/10 text-danger' : p.stock <= 10 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                      {p.stock} <span className="font-medium text-[10px] uppercase">sp</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(p.id)}
                      className={`p-2 rounded-xl transition-all ${p.active ? 'text-success bg-success/10 hover:bg-success/20' : 'text-text-light bg-bg-gray hover:bg-bg-gray/80'}`}
                    >
                      {p.active ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-text-light hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="px-6 py-20 text-center text-text-gray italic font-medium">Không tìm thấy sản phẩm nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-10 py-6 border-b border-border flex items-center justify-between bg-bg-gray/30">
              <div>
                <h2 className="text-2xl font-bold text-text-dark">{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                <p className="text-sm text-text-gray mt-0.5 font-medium italic">Cập nhật thông tin chi tiết cho mặt hàng trong cửa hàng.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-white rounded-full text-text-light hover:text-danger transition-all shadow-sm border border-transparent hover:border-border"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid lg:grid-cols-12 gap-10">
                {/* Left side - Info */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Tên sản phẩm *</label>
                      <input 
                        type="text" name="name" value={formData.name} onChange={handleInputChange}
                        placeholder="Nhập tên sản phẩm..."
                        className="w-full px-5 py-3.5 bg-bg-gray/50 border border-border rounded-2xl text-sm font-semibold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Danh mục *</label>
                      <div 
                        onClick={() => setShowFormCatDropdown(!showFormCatDropdown)}
                        className="w-full px-5 py-3.5 bg-bg-gray/50 border border-border rounded-2xl text-sm font-semibold flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                      >
                        <span className={formData.category ? 'text-text-dark' : 'text-text-light'}>
                          {formData.category || 'Chọn danh mục sản phẩm...'}
                        </span>
                        <FiChevronDown className={`text-text-light transition-transform ${showFormCatDropdown ? 'rotate-180' : ''}`} size={18} />
                      </div>
                      
                      {showFormCatDropdown && (
                        <div className="absolute left-0 mt-2 w-full bg-white rounded-[1.5rem] shadow-2xl border border-border py-4 z-[120] animate-fade-in">
                          {categoryGroups.map((cat) => (
                            <div key={cat.label} className="relative group/cat px-3">
                              <div className="flex items-center justify-between px-5 py-3 rounded-xl hover:bg-bg-gray/50 hover:text-primary transition-colors cursor-default text-sm font-bold text-text-dark">
                                {cat.label}
                                <FiChevronRight size={16} className="text-text-light" />
                              </div>
                              <div className="absolute left-[99%] top-0 min-w-[240px] bg-white rounded-[1.5rem] shadow-2xl border border-border py-4 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-[130]">
                                {cat.subs.map((sub) => (
                                  <div 
                                    key={sub}
                                    onClick={() => { setFormData({...formData, category: `${sub} (${cat.label})`}); setShowFormCatDropdown(false); }}
                                    className="px-7 py-2.5 text-sm font-semibold text-text-gray hover:text-primary hover:bg-bg-gray/50 cursor-pointer transition-colors"
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

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Giá gốc (VNĐ) *</label>
                        <input 
                          type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange}
                          className="w-full px-5 py-3.5 bg-bg-gray/50 border border-border rounded-2xl text-sm font-bold text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Giá giảm (VNĐ) *</label>
                        <input 
                          type="number" name="price" value={formData.price} onChange={handleInputChange}
                          className="w-full px-5 py-3.5 bg-bg-gray/50 border border-border rounded-2xl text-sm font-bold text-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Số lượng tồn kho *</label>
                        <input 
                          type="number" name="stock" value={formData.stock} onChange={handleInputChange}
                          className="w-full px-5 py-3.5 bg-bg-gray/50 border border-border rounded-2xl text-sm font-bold text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Mô tả sản phẩm</label>
                      <textarea 
                        name="description" rows={5} value={formData.description} onChange={handleInputChange}
                        placeholder="Mô tả đặc điểm, công dụng, thành phần..."
                        className="w-full px-5 py-4 bg-bg-gray/50 border border-border rounded-[1.5rem] text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Right side - Image */}
                <div className="lg:col-span-5 flex flex-col h-full">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Hình ảnh sản phẩm</label>
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="flex-1 min-h-[300px] bg-bg-gray/30 border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-primary transition-all group overflow-hidden relative"
                  >
                    {formData.image ? (
                      <div className="w-full h-full relative group/img">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded-[2rem]" />
                        <div className="absolute inset-0 bg-text-dark/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                          <FiRefreshCw className="text-white animate-spin-slow" size={32} />
                          <p className="text-white text-xs font-black uppercase tracking-tighter">Thay đổi hình ảnh</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10 border border-primary/20">
                          <FiUploadCloud size={32} />
                        </div>
                        <p className="text-base font-black text-text-dark mb-1">Tải ảnh sản phẩm</p>
                        <p className="text-xs text-text-gray font-medium px-10">Kéo thả ảnh hoặc nhấn để chọn từ máy tính</p>
                        <div className="mt-8 px-6 py-2.5 bg-primary text-white text-[11px] font-black rounded-full uppercase tracking-wider shadow-lg shadow-primary/20">Chọn file</div>
                      </>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="col-span-1 py-4 bg-white border border-border text-text-gray font-bold rounded-2xl hover:bg-bg-gray transition-all shadow-sm"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`col-span-2 py-4 bg-secondary text-white font-bold rounded-2xl hover:bg-secondary-light transition-all shadow-xl shadow-secondary/20 flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          {editingId ? <FiEdit2 size={20} /> : <FiPlus size={20} />} {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
