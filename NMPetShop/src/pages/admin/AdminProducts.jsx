import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiFilter } from 'react-icons/fi';

const products = [
  { id: 1, name: 'Hạt Khô Cao Cấp', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=80&h=80&fit=crop', category: 'Thức ăn cho chó', price: 850000, stock: 24, active: true },
  { id: 2, name: 'Cần Câu Mèo', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=80&h=80&fit=crop', category: 'Đồ chơi', price: 45000, stock: 2, active: true },
  { id: 3, name: 'Đệm Ngủ Tròn', image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=80&h=80&fit=crop', category: 'Phụ kiện', price: 350000, stock: 0, active: false },
  { id: 4, name: 'Vòng cổ LED phát sáng', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=80&h=80&fit=crop', category: 'Phụ kiện', price: 120000, stock: 15, active: true },
  { id: 5, name: 'Sữa tắm thảo dược', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&h=80&fit=crop', category: 'Chăm sóc', price: 195000, stock: 8, active: true },
];

const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

const AdminProducts = () => {
  const [search, setSearch] = useState('');

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Sản phẩm</h1>
          <p className="text-sm text-text-gray mt-1">Quản lý kho hàng và danh mục sản phẩm của bạn.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary hover:bg-secondary-light text-white font-semibold rounded-lg transition-colors text-sm">
          <FiPlus size={16} /> Thêm sản phẩm mới
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm focus:border-primary" placeholder="Tìm kiếm tên, mã sản phẩm..." />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm text-text-gray hover:border-primary transition-colors">
          <FiFilter size={16} /> Tất cả danh mục
        </button>
        <button className="px-4 py-2.5 border border-border rounded-lg text-sm text-text-gray hover:border-primary transition-colors">Trạng thái</button>
        <button className="px-4 py-2.5 bg-secondary text-white rounded-lg text-sm font-medium">Sắp hết hàng (3)</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-text-gray uppercase bg-bg-gray border-b border-border">
              <th className="px-6 py-3">Sản phẩm</th>
              <th className="px-6 py-3">Danh mục</th>
              <th className="px-6 py-3">Giá bán</th>
              <th className="px-6 py-3">Tồn kho</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-bg-gray/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-sm font-medium text-text-dark">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-gray">{p.category}</td>
                <td className="px-6 py-4 text-sm font-semibold text-primary">{formatPrice(p.price)}</td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${p.stock <= 2 ? 'text-danger' : p.stock <= 10 ? 'text-warning' : 'text-success'}`}>
                    {p.stock} sản phẩm
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className={`text-text-gray hover:text-primary transition-colors`}>
                    {p.active ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-text-light hover:text-primary transition-colors"><FiEdit2 size={16} /></button>
                    <button className="p-2 text-text-light hover:text-danger transition-colors"><FiTrash2 size={16} /></button>
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

export default AdminProducts;
