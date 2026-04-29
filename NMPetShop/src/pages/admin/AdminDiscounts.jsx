import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiTag, FiCalendar, FiFilter } from 'react-icons/fi';

const discounts = [
  { id: 1, code: 'SUMMER2024', description: 'Giảm giá mùa hè', type: 'Phần trăm', value: '15%', minOrder: 500000, startDate: '01/06/2024', endDate: '30/06/2024', status: 'Đang diễn ra', statusColor: 'bg-success/10 text-success' },
  { id: 2, code: 'NEWUSER50', description: 'Ưu đãi khách hàng mới', type: 'Số tiền', value: '50.000đ', minOrder: 200000, startDate: '01/01/2024', endDate: '31/12/2024', status: 'Đang diễn ra', statusColor: 'bg-success/10 text-success' },
  { id: 3, code: 'FREESHIP', description: 'Miễn phí vận chuyển toàn quốc', type: 'Phí ship', value: '100%', minOrder: 1000000, startDate: '15/10/2023', endDate: '31/10/2023', status: 'Đã kết thúc', statusColor: 'bg-text-light/10 text-text-gray' },
  { id: 4, code: 'FLASHCAT', description: 'Flash sale đồ dùng cho mèo', type: 'Phần trăm', value: '20%', minOrder: 0, startDate: '25/11/2024', endDate: '27/11/2024', status: 'Sắp diễn ra', statusColor: 'bg-info/10 text-info' },
  { id: 5, code: 'VIPMEM', description: 'Giảm giá hội viên VIP', type: 'Phần trăm', value: '10%', minOrder: 0, startDate: '01/01/2024', endDate: '31/12/2024', status: 'Đang diễn ra', statusColor: 'bg-success/10 text-success' },
];

const AdminDiscounts = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Khuyến mãi & Giảm giá</h1>
          <p className="text-sm text-text-gray mt-1">Quản lý các chương trình khuyến mãi, mã giảm giá của cửa hàng.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white font-semibold rounded-lg transition-colors text-sm">
          <FiPlus size={16} /> Thêm mã giảm giá
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="Tìm kiếm mã giảm giá, tên chương trình..." />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-text-gray hover:border-primary transition-colors">
          <FiFilter size={16} /> Loại giảm giá
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-text-gray hover:border-primary transition-colors">
          <FiCalendar size={16} /> Thời gian
        </button>
        <button className="px-4 py-2.5 border border-border rounded-lg text-sm text-text-gray hover:border-primary transition-colors">Trạng thái</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-text-gray uppercase bg-bg-gray border-b border-border">
              <th className="px-6 py-3">Mã giảm giá</th>
              <th className="px-6 py-3">Chi tiết mức giảm</th>
              <th className="px-6 py-3">Đơn tối thiểu</th>
              <th className="px-6 py-3">Thời gian áp dụng</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-b border-border last:border-0 hover:bg-bg-gray/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FiTag size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text-dark block">{d.code}</span>
                      <span className="text-xs text-text-gray mt-0.5 block">{d.description}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-primary block">{d.value}</span>
                  <span className="text-xs text-text-gray">{d.type}</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {d.minOrder > 0 ? new Intl.NumberFormat('vi-VN').format(d.minOrder) + 'đ' : 'Không giới hạn'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-text-gray">
                    <FiCalendar size={14} className="text-text-light" />
                    <span>{d.startDate} - {d.endDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${d.statusColor}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-text-light hover:text-primary transition-colors" title="Chỉnh sửa"><FiEdit2 size={16} /></button>
                    <button className="p-2 text-text-light hover:text-danger transition-colors" title="Xóa"><FiTrash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDiscounts;
