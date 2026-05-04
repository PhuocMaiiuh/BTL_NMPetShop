import { useState, useMemo, useRef, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiTag, FiCalendar, FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

const defaultDiscounts = [
  { id: 1, code: 'SUMMER2024', description: 'Giảm giá mùa hè', type: 'Phần trăm', value: '15%', minOrder: 500000, startDate: '2024-06-01', endDate: '2024-06-30', status: 'Đang diễn ra', statusColor: 'bg-success/10 text-success' },
  { id: 2, code: 'NEWUSER50', description: 'Ưu đãi khách hàng mới', type: 'Số tiền', value: '50.000đ', minOrder: 200000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Đang diễn ra', statusColor: 'bg-success/10 text-success' },
  { id: 3, code: 'FREESHIP', description: 'Miễn phí vận chuyển toàn quốc', type: 'Phí ship', value: '100%', minOrder: 1000000, startDate: '2023-10-15', endDate: '2023-10-31', status: 'Đã kết thúc', statusColor: 'bg-text-light/10 text-text-gray' },
  { id: 4, code: 'FLASHCAT', description: 'Flash sale đồ dùng cho mèo', type: 'Phần trăm', value: '20%', minOrder: 0, startDate: '2024-11-25', endDate: '2024-11-27', status: 'Sắp diễn ra', statusColor: 'bg-info/10 text-info' },
  { id: 5, code: 'VIPMEM', description: 'Giảm giá hội viên VIP', type: 'Phần trăm', value: '10%', minOrder: 0, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Đang diễn ra', statusColor: 'bg-success/10 text-success' },
];

const discountTypes = ['Phần trăm', 'Số tiền', 'Phí ship'];
const statusOptions = ['Đang diễn ra', 'Sắp diễn ra', 'Đã kết thúc'];
const timeOptions = ['Tất cả', 'Tháng này', 'Năm nay'];

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState(() => {
    const saved = localStorage.getItem('nm_petshop_discounts');
    return saved ? JSON.parse(saved) : defaultDiscounts;
  });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Tất cả');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const typeRef = useRef(null);
  const statusRef = useRef(null);
  const timeRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'Phần trăm',
    value: '',
    minOrder: 0,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    localStorage.setItem('nm_petshop_discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) setShowTypeDropdown(false);
      if (statusRef.current && !statusRef.current.contains(event.target)) setShowStatusDropdown(false);
      if (timeRef.current && !timeRef.current.contains(event.target)) setShowTimeDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDiscounts = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return discounts.filter(d => {
      const matchesSearch = d.code.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || d.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || d.status === statusFilter;

      let matchesTime = true;
      const startDate = new Date(d.startDate);
      if (timeFilter === 'Tháng này') {
        matchesTime = startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
      } else if (timeFilter === 'Năm nay') {
        matchesTime = startDate.getFullYear() === currentYear;
      }

      return matchesSearch && matchesType && matchesStatus && matchesTime;
    });
  }, [search, typeFilter, statusFilter, timeFilter, discounts]);

  const formatDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length !== 3) return d;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handleDeleteDiscount = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này không? Thao tác này không thể hoàn tác.')) {
      setDiscounts(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleEditDiscount = (d) => {
    setEditingId(d.id);
    setFormData({
      code: d.code,
      description: d.description,
      type: d.type,
      value: d.type === 'Phần trăm' ? d.value.replace('%', '') : (d.type === 'Số tiền' ? d.value.replace(/\./g, '').replace('đ', '') : '100'),
      minOrder: d.minOrder,
      startDate: d.startDate,
      endDate: d.endDate
    });
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minOrder' ? Number(value) : value
    }));
  };

  const handleSaveDiscount = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value || !formData.startDate || !formData.endDate) {
      alert('Vui lòng nhập đầy đủ các trường bắt buộc (*)');
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      const now = new Date();
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      let status = 'Sắp diễn ra';
      let statusColor = 'bg-info/10 text-info';
      
      if (now >= start && now <= end) {
        status = 'Đang diễn ra';
        statusColor = 'bg-success/10 text-success';
      } else if (now > end) {
        status = 'Đã kết thúc';
        statusColor = 'bg-text-light/10 text-text-gray';
      }

      const updatedValue = formData.type === 'Phần trăm' ? `${formData.value}%` : (formData.type === 'Số tiền' ? `${new Intl.NumberFormat('vi-VN').format(formData.value)}đ` : '100%');

      if (editingId) {
        setDiscounts(prev => prev.map(d => 
          d.id === editingId 
            ? { ...d, ...formData, code: formData.code.toUpperCase(), status, statusColor, value: updatedValue } 
            : d
        ));
      } else {
        const newDiscount = {
          id: discounts.length > 0 ? Math.max(...discounts.map(d => d.id)) + 1 : 1,
          ...formData,
          code: formData.code.toUpperCase(),
          status,
          statusColor,
          value: updatedValue
        };
        setDiscounts(prev => [newDiscount, ...prev]);
      }

      setIsSaving(false);
      setShowAddModal(false);
      setEditingId(null);
      setFormData({
        code: '',
        description: '',
        type: 'Phần trăm',
        value: '',
        minOrder: 0,
        startDate: '',
        endDate: ''
      });
      alert(editingId ? 'Cập nhật mã giảm giá thành công!' : 'Thêm mã giảm giá thành công!');
    }, 600);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({
      code: '',
      description: '',
      type: 'Phần trăm',
      value: '',
      minOrder: 0,
      startDate: '',
      endDate: ''
    });
  };

  return (
    <div className="pb-10 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Khuyến mãi & Giảm giá</h1>
          <p className="text-sm text-text-gray mt-1">Quản lý các chương trình khuyến mãi, mã giảm giá của cửa hàng.</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setShowAddModal(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white font-semibold rounded-xl shadow-lg shadow-secondary/20 transition-all text-sm"
        >
          <FiPlus size={16} /> Thêm mã giảm giá
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-6 h-12">
        <div className="flex-1 max-w-xl relative h-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full pl-10 pr-10 border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-white"
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
            className={`flex items-center justify-between gap-2 px-4 h-full w-[180px] border rounded-xl text-sm font-medium transition-all ${typeFilter !== 'All' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-text-gray hover:border-primary bg-white'}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <FiFilter size={16} className="flex-shrink-0" />
              <span className="truncate">{typeFilter === 'All' ? 'Loại giảm giá' : typeFilter}</span>
            </div>
            <FiChevronDown size={14} className={`transition-transform flex-shrink-0 ${showTypeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTypeDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
              <div onClick={() => { setTypeFilter('All'); setShowTypeDropdown(false); }} className="px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border font-medium">Tất cả loại</div>
              {discountTypes.map(t => (
                <div key={t} onClick={() => { setTypeFilter(t); setShowTypeDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${typeFilter === t ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Filter */}
        <div className="relative h-full" ref={timeRef}>
          <button
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            className={`flex items-center justify-between gap-2 px-4 h-full w-[175px] border rounded-xl text-sm font-medium transition-all ${timeFilter !== 'Tất cả' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-text-gray hover:border-primary bg-white'}`}
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
                <div key={t} onClick={() => { setTimeFilter(t); setShowTimeDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${t === 'Tất cả' ? 'border-b border-border font-medium' : ''} ${timeFilter === t ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>
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
            className={`flex items-center justify-between gap-2 px-4 h-full w-[160px] border rounded-xl text-sm font-medium transition-all ${statusFilter !== 'All' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border text-text-gray hover:border-primary bg-white'}`}
          >
            <span className="truncate">{statusFilter === 'All' ? 'Trạng thái' : statusFilter}</span>
            <FiChevronDown size={14} className={`flex-shrink-0 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full right-0 mt-2 w-full bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
              <div onClick={() => { setStatusFilter('All'); setShowStatusDropdown(false); }} className="px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer border-b border-border font-medium">Tất cả trạng thái</div>
              {statusOptions.map(s => (
                <div key={s} onClick={() => { setStatusFilter(s); setShowStatusDropdown(false); }} className={`px-4 py-2.5 text-sm hover:bg-bg-gray cursor-pointer ${statusFilter === s ? 'text-primary bg-primary/5 font-semibold' : 'text-text-gray'}`}>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters Button - Fixed position to avoid jumping */}
        <div className="w-20">
          {(search || typeFilter !== 'All' || statusFilter !== 'All' || timeFilter !== 'Tất cả') && (
            <button
              onClick={() => { setSearch(''); setTypeFilter('All'); setStatusFilter('All'); setTimeFilter('Tất cả'); }}
              className="text-xs font-bold text-accent hover:text-accent-dark transition-colors px-2 whitespace-nowrap"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-text-gray uppercase bg-bg-gray/50 border-b border-border">
              <th className="px-6 py-4">Mã giảm giá</th>
              <th className="px-6 py-4">Chi tiết mức giảm</th>
              <th className="px-6 py-4">Đơn tối thiểu</th>
              <th className="px-6 py-4">Thời gian áp dụng</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredDiscounts.length > 0 ? (
              filteredDiscounts.map((d) => (
                <tr key={d.id} className="hover:bg-bg-gray/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                        <FiTag size={18} />
                      </div>
                      <div>
                        <span className="text-sm font-black text-text-dark block tracking-tight uppercase">{d.code}</span>
                        <span className="text-[11px] text-text-gray mt-0.5 block font-medium">{d.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-primary block">{d.value}</span>
                    <span className="text-[11px] font-bold text-text-light uppercase tracking-wider">{d.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-text-dark">
                    {d.minOrder > 0 ? new Intl.NumberFormat('vi-VN').format(d.minOrder) + 'đ' : 'Không giới hạn'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-text-gray">
                      <FiCalendar size={14} className="text-text-light" />
                      <span>{formatDate(d.startDate)} - {formatDate(d.endDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${d.statusColor}`}>
                      {d.status}
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
                        onClick={() => handleDeleteDiscount(d.id)}
                        className="p-2 text-text-light hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                        title="Xóa"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
                    {formData.type === 'Phần trăm' ? 'Phần trăm giảm (%) *' : (formData.type === 'Số tiền' ? 'Số tiền giảm (VNĐ) *' : 'Mức giảm (Mặc định 100%)')}
                  </label>
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    disabled={formData.type === 'Phí ship'}
                    placeholder={formData.type === 'Phí ship' ? '100' : 'Nhập giá trị...'}
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
                        onClick={() => setFormData(prev => ({ ...prev, type }))}
                        className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all border ${formData.type === type ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-white border-border text-text-gray hover:border-primary hover:text-primary'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min Order */}
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Đơn tối thiểu (VNĐ)</label>
                  <input
                    type="number"
                    name="minOrder"
                    value={formData.minOrder}
                    onChange={handleInputChange}
                    placeholder="0"
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
