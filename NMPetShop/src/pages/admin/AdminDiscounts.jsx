import { useState, useMemo, useRef, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiTag, FiCalendar, FiFilter, FiChevronDown, FiX, FiLoader } from 'react-icons/fi';
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from '../../services/promotionApi';

const discountTypes = ['percentage', 'fixed', 'free_shipping'];
const typeLabels = {
  'percentage': 'Phần trăm',
  'fixed': 'Số tiền',
  'free_shipping': 'Phí ship'
};
const statusOptions = ['active', 'upcoming', 'expired'];
const statusLabels = {
  'active': 'Đang diễn ra',
  'upcoming': 'Sắp diễn ra',
  'expired': 'Đã kết thúc'
};
const timeOptions = ['Tất cả', 'Tháng này', 'Năm nay'];

import Pagination from '../../components/admin/Pagination';

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Tất cả');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: 0,
    usageLimit: '',
    startDate: '',
    endDate: ''
  });

  const typeRef = useRef(null);
  const statusRef = useRef(null);
  const timeRef = useRef(null);

  const loadPromotions = async (pageToLoad = page) => {
    setLoading(true);
    try {
      const params = {
        page: pageToLoad,
        limit: 20
      };
      if (typeFilter !== 'All') params.discountType = typeFilter;
      if (statusFilter !== 'All') params.filterStatus = statusFilter;
      if (search) params.search = search;
      
      const data = await fetchPromotions(params);
      setDiscounts(data.promotions || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    loadPromotions(1);
  }, [typeFilter, statusFilter, search]);

  // Handle page change specifically
  useEffect(() => {
    if (page !== 1) {
      loadPromotions(page);
    }
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) setShowTypeDropdown(false);
      if (statusRef.current && !statusRef.current.contains(event.target)) setShowStatusDropdown(false);
      if (timeRef.current && !timeRef.current.contains(event.target)) setShowTimeDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getStatusInfo = (d) => {
    const now = new Date();
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    
    if (now >= start && now <= end) return { id: 'active', label: 'Đang diễn ra', color: 'bg-green-500/10 text-green-600' };
    if (now < start) return { id: 'upcoming', label: 'Sắp diễn ra', color: 'bg-blue-500/10 text-blue-600' };
    return { id: 'expired', label: 'Đã kết thúc', color: 'bg-gray-400/10 text-gray-500' };
  };

  const filteredDiscounts = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return (discounts || []).filter(d => {
      if (!d) return false;

      // Time filter
      let matchesTime = true;
      const startDate = new Date(d.startDate);
      if (timeFilter === 'Tháng này') {
        matchesTime = startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
      } else if (timeFilter === 'Năm nay') {
        matchesTime = startDate.getFullYear() === currentYear;
      }

      // Type filter (Fallback)
      let matchesType = true;
      if (typeFilter !== 'All') {
        matchesType = d.discountType === typeFilter;
      }

      // Status filter (Fallback)
      let matchesStatus = true;
      if (statusFilter !== 'All') {
        const s = getStatusInfo(d);
        matchesStatus = s.id === statusFilter;
      }

      return matchesTime && matchesType && matchesStatus;
    });
  }, [timeFilter, typeFilter, statusFilter, discounts]);

  const handleDeleteDiscount = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này không?')) {
      try {
        await deletePromotion(id);
        setDiscounts(prev => prev.filter(d => d._id !== id));
        alert('Xóa mã giảm giá thành công!');
      } catch (err) {
        alert('Lỗi khi xóa mã giảm giá!');
      }
    }
  };

  const handleEditDiscount = (d) => {
    setEditingId(d._id);
    setFormData({
      code: d.code,
      description: d.description || '',
      discountType: d.discountType,
      discountValue: d.discountValue,
      minOrderValue: d.minOrderValue,
      usageLimit: d.usageLimit || '',
      startDate: d.startDate.split('T')[0],
      endDate: d.endDate.split('T')[0]
    });
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'minOrderValue' || name === 'discountValue' || name === 'usageLimit') ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSaveDiscount = async (e) => {
    e.preventDefault();
    const { code, discountValue, startDate, endDate, description } = formData;
    
    if (!code || !startDate || !endDate || !description) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc (*)');
      return;
    }

    if (discountValue === '' || discountValue === null || isNaN(discountValue)) {
      alert('Vui lòng nhập mức giảm giá hợp lệ');
      return;
    }

    setIsSaving(true);
    try {
      const data = { 
        ...formData, 
        code: formData.code.toUpperCase(),
        title: formData.description // Support older backend that requires title
      };
      if (editingId) {
        const result = await updatePromotion(editingId, data);
        setDiscounts(prev => prev.map(d => d._id === editingId ? result : d));
      } else {
        const result = await createPromotion(data);
        setDiscounts(prev => [result, ...prev]);
      }
      setShowAddModal(false);
      setEditingId(null);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderValue: 0,
        usageLimit: '',
        startDate: '',
        endDate: ''
      });
      alert(editingId ? 'Cập nhật thành công!' : 'Thêm thành công!');
    } catch (err) {
      console.error('Save error:', err);
      const details = err.details ? `\n- ${err.details.join('\n- ')}` : '';
      alert(`${err.message}${details}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: 0,
      usageLimit: '',
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="pb-10 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Khuyến mãi & Giảm giá</h1>
          <p className="text-sm text-text-gray mt-1 font-medium">Quản lý các chương trình khuyến mãi, mã giảm giá của cửa hàng.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setShowAddModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary-light text-white font-black rounded-xl shadow-lg shadow-secondary/25 transition-all text-sm uppercase tracking-wider"
        >
          <FiPlus size={18} /> Thêm mã giảm giá
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-6 h-12">
        <div className="flex-1 max-w-xl relative h-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full pl-11 pr-10 border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-white"
            placeholder="Tìm kiếm mã giảm giá, tên chương trình..."
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-dark">
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Type Filter */}
        <div className="relative h-full" ref={typeRef}>
          <button
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            className={`flex items-center justify-between gap-2 px-4 h-full w-[180px] border rounded-xl text-sm font-bold transition-all ${typeFilter !== 'All' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-text-gray hover:border-primary bg-white'}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FiFilter size={16} className="flex-shrink-0" />
              <span className="truncate">{typeFilter === 'All' ? 'Loại giảm giá' : typeLabels[typeFilter]}</span>
            </div>
            <FiChevronDown size={14} className={`transition-transform flex-shrink-0 ${showTypeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTypeDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
              <div onClick={() => { setTypeFilter('All'); setShowTypeDropdown(false); }} className="px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border font-bold">Tất cả loại</div>
              {Object.keys(typeLabels).map(t => (
                <div key={t} onClick={() => { setTypeFilter(t); setShowTypeDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${typeFilter === t ? 'text-primary bg-primary/5 font-bold' : 'text-text-gray font-medium'}`}>
                  {typeLabels[t]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Filter */}
        <div className="relative h-full" ref={timeRef}>
          <button
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            className={`flex items-center justify-between gap-2 px-4 h-full w-[175px] border rounded-xl text-sm font-bold transition-all ${timeFilter !== 'Tất cả' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-text-gray hover:border-primary bg-white'}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FiCalendar size={16} className="flex-shrink-0" />
              <span className="truncate">{timeFilter === 'Tất cả' ? 'Thời gian' : timeFilter}</span>
            </div>
            <FiChevronDown size={14} className={`transition-transform flex-shrink-0 ${showTimeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTimeDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
              {timeOptions.map(t => (
                <div key={t} onClick={() => { setTimeFilter(t); setShowTimeDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${t === 'Tất cả' ? 'border-b border-border font-bold' : 'font-medium'} ${timeFilter === t ? 'text-primary bg-primary/5 font-bold' : 'text-text-gray'}`}>
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative h-full" ref={statusRef}>
          <button
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className={`flex items-center justify-between gap-2 px-4 h-full w-[170px] border rounded-xl text-sm font-bold transition-all ${statusFilter !== 'All' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-text-gray hover:border-primary bg-white'}`}
          >
            <span className="truncate">{statusFilter === 'All' ? 'Trạng thái' : statusLabels[statusFilter]}</span>
            <FiChevronDown size={14} className={`flex-shrink-0 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full right-0 mt-2 w-full bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
              <div onClick={() => { setStatusFilter('All'); setShowStatusDropdown(false); }} className="px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border font-bold">Tất cả trạng thái</div>
              {Object.keys(statusLabels).map(s => (
                <div key={s} onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${statusFilter === s ? 'text-primary bg-primary/5 font-bold' : 'text-text-gray font-medium'}`}>
                  {statusLabels[s]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        <div className="min-w-[80px]">
          {(search || typeFilter !== 'All' || statusFilter !== 'All' || timeFilter !== 'Tất cả') && (
            <button
              onClick={() => { setSearch(''); setTypeFilter('All'); setStatusFilter('All'); setTimeFilter('Tất cả'); }}
              className="text-xs font-black text-accent hover:text-accent-dark transition-colors px-2 whitespace-nowrap uppercase tracking-widest"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[11px] font-black text-text-gray uppercase tracking-widest bg-bg-gray/40 border-b border-border">
              <th className="px-6 py-4">Mã giảm giá</th>
              <th className="px-6 py-4">Mức giảm</th>
              <th className="px-6 py-4">Đơn tối thiểu</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <FiLoader size={32} className="animate-spin text-primary" />
                    <span className="text-xs text-text-gray font-bold uppercase tracking-widest">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : filteredDiscounts.length > 0 ? (
              filteredDiscounts.map((d) => {
                const statusInfo = getStatusInfo(d);
                return (
                  <tr key={d._id} className="hover:bg-bg-gray/20 transition-colors group">
                    <td className="px-6 py-5 max-w-[280px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-105 transition-transform shrink-0">
                          <FiTag size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-black text-text-dark block tracking-tight uppercase mb-0.5">{d.code}</span>
                          <span className="text-[11px] text-text-gray font-medium line-clamp-1">{d.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-black text-primary block">
                        {d.discountType === 'percentage' ? `${d.discountValue}%` : 
                         d.discountType === 'fixed' ? `${new Intl.NumberFormat('vi-VN').format(d.discountValue)}đ` : 'Miễn phí'}
                      </span>
                      <span className="text-[10px] font-black text-text-light uppercase tracking-wider">{typeLabels[d.discountType]}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-text-dark">
                      {d.minOrderValue > 0 ? new Intl.NumberFormat('vi-VN').format(d.minOrderValue) + 'đ' : 'Không giới hạn'}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-gray">
                        <FiCalendar size={13} className="text-text-light" />
                        <span>{formatDate(d.startDate)} - {formatDate(d.endDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditDiscount(d)}
                          className="p-2 text-text-light hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(d._id)}
                          className="p-2 text-text-light hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <FiTag size={48} className="text-border mb-3" />
                    <p className="text-text-gray italic font-medium">Không tìm thấy mã giảm giá nào phù hợp.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={(p) => setPage(p)} 
      />

      {/* Add/Edit Discount Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-text-dark/40 backdrop-blur-sm animate-fade-in" onClick={handleCloseModal}></div>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-bg-gray/30">
              <div>
                <h2 className="text-xl font-bold text-text-dark">{editingId ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới'}</h2>
                <p className="text-xs text-text-gray mt-1 font-medium italic">Thiết lập các điều kiện ưu đãi cho khách hàng.</p>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-white rounded-full text-text-light hover:text-danger transition-all shadow-sm border border-transparent hover:border-border"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveDiscount} className="p-8">
              <div className="grid grid-cols-2 gap-6">
                {/* Code */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Mã giảm giá *</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: SUMMER2024"
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm font-bold text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all uppercase placeholder:normal-case placeholder:font-medium"
                  />
                </div>

                {/* Value */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">
                    {formData.discountType === 'percentage' ? 'Phần trăm giảm (%) *' : (formData.discountType === 'fixed' ? 'Số tiền giảm (VNĐ) *' : 'Mức giảm (Mặc định 100%)')}
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    disabled={formData.discountType === 'free_shipping'}
                    placeholder={formData.discountType === 'free_shipping' ? '100' : 'Nhập giá trị...'}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm font-bold text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:bg-bg-gray disabled:cursor-not-allowed"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Tên chương trình / Mô tả *</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Mô tả ngắn gọn về chương trình khuyến mãi..."
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

                {/* Type Selection */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Loại giảm giá</label>
                  <div className="flex gap-2">
                    {discountTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          discountType: type, 
                          discountValue: type === 'free_shipping' ? 100 : (prev.discountType === 'free_shipping' ? '' : prev.discountValue)
                        }))}
                        className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${formData.discountType === type ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-white border-border text-text-gray hover:border-primary hover:text-primary'}`}
                      >
                        {typeLabels[type]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Order Value */}
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-text-gray uppercase tracking-wider">Đơn tối thiểu (VNĐ)</label>
                    <label className="flex items-center gap-1.5 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={formData.minOrderValue === 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.checked ? 0 : '' }))}
                        className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                      />
                      <span className="text-[10px] font-black text-text-gray uppercase tracking-widest group-hover:text-primary transition-colors">Không giới hạn</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    name="minOrderValue"
                    value={formData.minOrderValue}
                    onChange={handleInputChange}
                    disabled={formData.minOrderValue === 0 && formData.minOrderValue !== ''}
                    placeholder="Nhập số tiền..."
                    className={`w-full px-4 py-3 border border-border rounded-xl text-sm font-bold text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all ${formData.minOrderValue === 0 && formData.minOrderValue !== '' ? 'bg-bg-gray/50 text-text-light' : 'bg-white'}`}
                  />
                </div>

                {/* Usage Limit */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Số lần sử dụng tối đa</label>
                  <input
                    type="number"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Để trống = Không giới hạn"
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm font-bold text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

                {/* Start Date */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Ngày bắt đầu *</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" size={16} />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                  </div>
                </div>

                {/* End Date */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Ngày kết thúc *</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" size={16} />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-border rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 bg-white border border-border text-text-gray font-bold rounded-2xl hover:bg-bg-gray transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`flex-[2] py-3 bg-secondary text-white font-bold rounded-2xl hover:bg-secondary-light transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      {editingId ? <FiEdit2 size={18} /> : <FiPlus size={18} />} {editingId ? 'Cập nhật mã' : 'Tạo mã giảm giá'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiscounts;
