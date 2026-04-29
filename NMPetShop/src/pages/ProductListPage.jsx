import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';

const allProducts = [
  { id: 1, name: 'Hạt khô cao cấp cho chó trưởng thành', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop', price: 110000, rating: 4, reviews: 8, category: 'Thức ăn cho chó', brand: 'Royal Canin' },
  { id: 2, name: 'Thức ăn ướt cho mèo vị cá ngừ', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', price: 320000, rating: 5, reviews: 12, category: 'Thức ăn cho mèo', brand: 'Whiskas' },
  { id: 3, name: 'Pate cho chó con vị gà', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop', price: 382500, originalPrice: 450000, rating: 4, reviews: 6, category: 'Thức ăn cho chó', badge: 'Sale', brand: 'Pedigree' },
  { id: 4, name: 'Thức ăn hạt tự nhiên', image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=400&h=400&fit=crop', price: 180000, rating: 5, reviews: 15, category: 'Phụ kiện', brand: 'Me-O' },
  { id: 5, name: 'Vòng cổ da cao cấp cho chó', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop', price: 250000, originalPrice: 300000, rating: 4, reviews: 9, category: 'Phụ kiện', badge: 'Sale', brand: 'Royal Canin' },
  { id: 6, name: 'Đồ chơi bóng cao su', image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop', price: 85000, rating: 4, reviews: 20, category: 'Đồ chơi', brand: 'Pedigree' },
  { id: 7, name: 'Bát ăn inox chống lật', image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&h=400&fit=crop', price: 120000, rating: 5, reviews: 7, category: 'Phụ kiện', brand: 'Me-O' },
  { id: 8, name: 'Sữa tắm thảo dược cho mèo', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', price: 195000, originalPrice: 230000, rating: 4, reviews: 11, category: 'Chăm sóc', badge: 'Sale', brand: 'Whiskas' },
];

const mainCategories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'dog-food', label: 'Thức ăn cho chó' },
  { id: 'cat-food', label: 'Thức ăn cho mèo' },
  { id: 'acc', label: 'Phụ kiện' },
  { id: 'toy', label: 'Đồ chơi' },
  { id: 'health', label: 'Chăm sóc' }
];

const dogCategories = [
  { id: 'all-dog', label: 'Tất cả cho Chó' },
  { id: 'dry-food', label: 'Thức ăn hạt' },
  { id: 'pate', label: 'Pate & Đồ hộp' },
  { id: 'hygiene', label: 'Sữa tắm & Vệ sinh' }
];

const catCategories = [
  { id: 'all-cat', label: 'Tất cả cho Mèo' },
  { id: 'dry-food', label: 'Thức ăn hạt' },
  { id: 'pate', label: 'Pate & Đồ hộp' },
  { id: 'hygiene', label: 'Sữa tắm & Vệ sinh' }
];

const accessoryCategories = [
  { id: 'all-acc', label: 'Tất cả' },
  { id: 'acc-dog', label: 'Phụ kiện cho chó' },
  { id: 'acc-cat', label: 'Phụ kiện cho mèo' },
  { id: 'acc-collar', label: 'Vòng cổ & Dây dắt' },
  { id: 'acc-bowl', label: 'Bát ăn & Bình nước' },
  { id: 'acc-bed', label: 'Giường nệm & Chuồng' }
];

const toyCategories = [
  { id: 'all-toy', label: 'Tất cả' },
  { id: 'toy-dog', label: 'Đồ chơi cho chó' },
  { id: 'toy-cat', label: 'Đồ chơi cho mèo' },
  { id: 'toy-chew', label: 'Đồ chơi nhai gặm' },
  { id: 'toy-ball', label: 'Cần câu & Bóng' },
  { id: 'toy-scratch', label: 'Bàn cào móng' }
];

const healthCategories = [
  { id: 'all-health', label: 'Tất cả' },
  { id: 'health-dog', label: 'Chăm sóc cho chó' },
  { id: 'health-cat', label: 'Chăm sóc cho mèo' },
  { id: 'health-shampoo', label: 'Sữa tắm & Vệ sinh' },
  { id: 'health-medicine', label: 'Thuốc & Vitamin' },
  { id: 'health-tool', label: 'Dụng cụ cắt tỉa' }
];

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState(['Tất cả']);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Sắp xếp theo');
  const [showSort, setShowSort] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Update selected category when URL param changes
  useEffect(() => {
    if (categoryParam === 'cho') {
      setSelectedCategories(['Tất cả cho Chó']);
    } else if (categoryParam === 'meo') {
      setSelectedCategories(['Tất cả cho Mèo']);
    } else {
      setSelectedCategories(['Tất cả']);
    }
  }, [categoryParam]);

  const handleCheckboxClick = (catLabel, allLabel) => {
    if (catLabel === allLabel) {
      setSelectedCategories([allLabel]);
      return;
    }

    let newSelected = [...selectedCategories];

    // Remove "Tất cả..." if selecting a specific one
    if (newSelected.includes(allLabel)) {
      newSelected = newSelected.filter(c => c !== allLabel);
    }

    // Toggle the clicked category
    if (newSelected.includes(catLabel)) {
      newSelected = newSelected.filter(c => c !== catLabel);
    } else {
      newSelected.push(catLabel);
    }

    // If nothing selected, fallback to "Tất cả..."
    if (newSelected.length === 0) {
      newSelected = [allLabel];
    }

    setSelectedCategories(newSelected);
  };

  const handleBrandClick = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const filtered = allProducts.filter((p) => {
    if (p.price > maxPrice) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

    if (categoryParam === 'cho') {
      // Exclude cat specific products
      const isCatProduct = p.category.includes('mèo') || p.name.toLowerCase().includes('mèo');
      if (isCatProduct) return false;

      if (selectedCategories.includes('Tất cả cho Chó')) {
        return p.category.includes('chó') || p.name.toLowerCase().includes('chó') || p.category === 'Phụ kiện' || p.category === 'Đồ chơi' || p.category === 'Chăm sóc';
      }

      const matchesFood = selectedCategories.includes('Thức ăn hạt') && (p.name.toLowerCase().includes('hạt') || p.category === 'Thức ăn cho chó');
      const matchesPate = selectedCategories.includes('Pate & Đồ hộp') && p.name.toLowerCase().includes('pate');
      const matchesHygiene = selectedCategories.includes('Sữa tắm & Vệ sinh') && (p.category === 'Chăm sóc' || p.name.toLowerCase().includes('sữa tắm'));

      return matchesFood || matchesPate || matchesHygiene;
    }

    if (categoryParam === 'meo') {
      // Exclude dog specific products
      const isDogProduct = p.category.includes('chó') || p.name.toLowerCase().includes('chó');
      if (isDogProduct) return false;

      if (selectedCategories.includes('Tất cả cho Mèo')) {
        return p.category.includes('mèo') || p.name.toLowerCase().includes('mèo') || p.category === 'Phụ kiện' || p.category === 'Đồ chơi' || p.category === 'Chăm sóc';
      }

      const matchesFood = selectedCategories.includes('Thức ăn hạt') && (p.name.toLowerCase().includes('hạt') || p.category === 'Thức ăn cho mèo');
      const matchesPate = selectedCategories.includes('Pate & Đồ hộp') && p.name.toLowerCase().includes('pate');
      const matchesHygiene = selectedCategories.includes('Sữa tắm & Vệ sinh') && (p.category === 'Chăm sóc' || p.name.toLowerCase().includes('sữa tắm'));

      return matchesFood || matchesPate || matchesHygiene;
    }

    if (categoryParam === 'phu-kien') {
      if (p.category !== 'Phụ kiện') return false;

      if (selectedCategories.includes('Tất cả')) {
        return true;
      }

      const isGeneral = !p.name.toLowerCase().includes('chó') && !p.name.toLowerCase().includes('mèo');
      const matchesDog = selectedCategories.includes('Phụ kiện cho chó') && (p.name.toLowerCase().includes('chó') || isGeneral);
      const matchesCat = selectedCategories.includes('Phụ kiện cho mèo') && (p.name.toLowerCase().includes('mèo') || isGeneral);
      const matchesCollar = selectedCategories.includes('Vòng cổ & Dây dắt') && (p.name.toLowerCase().includes('vòng cổ') || p.name.toLowerCase().includes('dây dắt'));
      const matchesBowl = selectedCategories.includes('Bát ăn & Bình nước') && (p.name.toLowerCase().includes('bát ăn') || p.name.toLowerCase().includes('bình nước'));
      const matchesBed = selectedCategories.includes('Giường nệm & Chuồng') && (p.name.toLowerCase().includes('giường') || p.name.toLowerCase().includes('nệm') || p.name.toLowerCase().includes('chuồng'));

      return matchesDog || matchesCat || matchesCollar || matchesBowl || matchesBed;
    }

    if (categoryParam === 'do-choi') {
      if (p.category !== 'Đồ chơi') return false;

      if (selectedCategories.includes('Tất cả')) {
        return true;
      }

      const isGeneral = !p.name.toLowerCase().includes('chó') && !p.name.toLowerCase().includes('mèo');
      const matchesDog = selectedCategories.includes('Đồ chơi cho chó') && (p.name.toLowerCase().includes('chó') || isGeneral);
      const matchesCat = selectedCategories.includes('Đồ chơi cho mèo') && (p.name.toLowerCase().includes('mèo') || isGeneral);
      const matchesChew = selectedCategories.includes('Đồ chơi nhai gặm') && (p.name.toLowerCase().includes('nhai') || p.name.toLowerCase().includes('gặm') || p.name.toLowerCase().includes('xương'));
      const matchesBall = selectedCategories.includes('Cần câu & Bóng') && (p.name.toLowerCase().includes('cần câu') || p.name.toLowerCase().includes('bóng'));
      const matchesScratch = selectedCategories.includes('Bàn cào móng') && (p.name.toLowerCase().includes('cào') || p.name.toLowerCase().includes('trụ'));

      return matchesDog || matchesCat || matchesChew || matchesBall || matchesScratch;
    }

    if (categoryParam === 'suc-khoe') {
      if (p.category !== 'Chăm sóc') return false;

      if (selectedCategories.includes('Tất cả')) {
        return true;
      }

      const isGeneral = !p.name.toLowerCase().includes('chó') && !p.name.toLowerCase().includes('mèo');
      const matchesDog = selectedCategories.includes('Chăm sóc cho chó') && (p.name.toLowerCase().includes('chó') || isGeneral);
      const matchesCat = selectedCategories.includes('Chăm sóc cho mèo') && (p.name.toLowerCase().includes('mèo') || isGeneral);
      const matchesShampoo = selectedCategories.includes('Sữa tắm & Vệ sinh') && (p.name.toLowerCase().includes('sữa tắm') || p.name.toLowerCase().includes('khử mùi') || p.name.toLowerCase().includes('vệ sinh'));
      const matchesMedicine = selectedCategories.includes('Thuốc & Vitamin') && (p.name.toLowerCase().includes('thuốc') || p.name.toLowerCase().includes('vitamin') || p.name.toLowerCase().includes('dinh dưỡng'));
      const matchesTool = selectedCategories.includes('Dụng cụ cắt tỉa') && (p.name.toLowerCase().includes('kéo') || p.name.toLowerCase().includes('tông đơ') || p.name.toLowerCase().includes('lược') || p.name.toLowerCase().includes('kềm') || p.name.toLowerCase().includes('kìm'));

      return matchesDog || matchesCat || matchesShampoo || matchesMedicine || matchesTool;
    }

    return selectedCategories.includes('Tất cả') || selectedCategories.includes(p.category);
  });

  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortBy === 'Giá tăng dần') return a.price - b.price;
    if (sortBy === 'Giá giảm dần') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <a href="/" className="hover:text-primary">Trang chủ</a>
        <span>/</span>
        <span className="text-text-dark font-medium">Danh sách sản phẩm</span>
      </nav>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div>
            <div className="mb-8">
              <h3 className="font-semibold text-xl text-text-dark mb-5">Danh mục</h3>

              <div className="space-y-4">
                {(categoryParam === 'cho'
                  ? dogCategories
                  : categoryParam === 'meo'
                    ? catCategories
                    : categoryParam === 'phu-kien'
                      ? accessoryCategories
                      : categoryParam === 'do-choi'
                        ? toyCategories
                        : categoryParam === 'suc-khoe'
                          ? healthCategories
                          : mainCategories
                ).map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleCheckboxClick(cat.label, categoryParam === 'cho' ? 'Tất cả cho Chó' : categoryParam === 'meo' ? 'Tất cả cho Mèo' : 'Tất cả')}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat.label)
                        ? 'bg-[#2962ff] border-[#2962ff]'
                        : 'border-[#cbd5e1] group-hover:border-[#2962ff]/50'
                      }`}>
                      {selectedCategories.includes(cat.label) && (
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span className="text-[15px] text-[#475569]">
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8 border-t border-border pt-6">
              <h3 className="font-semibold text-lg text-text-dark mb-4">Khoảng giá</h3>
              <input
                type="range"
                min="0"
                max="5000000"
                step="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-gray mt-2">
                <span>0đ</span>
                <span className="font-medium text-text-dark">{maxPrice >= 5000000 ? '5.000.000đ+' : `${maxPrice.toLocaleString('vi-VN')}đ`}</span>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-8 border-t border-border pt-6">
              <h3 className="font-semibold text-lg text-text-dark mb-4">Thương hiệu</h3>
              <div className="space-y-3">
                {['Royal Canin', 'Pedigree', 'Whiskas', 'Me-O'].map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group" onClick={() => handleBrandClick(brand)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand)
                        ? 'bg-[#2962ff] border-[#2962ff]'
                        : 'border-[#cbd5e1] group-hover:border-[#2962ff]/50'
                      }`}>
                      {selectedBrands.includes(brand) && (
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span className="text-[15px] text-[#475569]">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary to-amber-400 rounded-2xl p-5 text-white">
              <h4 className="font-bold text-sm mb-1">Ưu đãi đặc biệt</h4>
              <p className="text-xs opacity-90 mb-3">Giảm 20% cho đơn hàng đầu tiên</p>
              <button className="px-4 py-2 bg-white text-secondary font-semibold rounded-lg text-xs">Áp dụng ngay</button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <p className="text-sm text-text-gray">Hiển thị <span className="font-semibold text-text-dark">{sortedAndFiltered.length}</span> sản phẩm</p>
            <div className="flex items-center gap-4">
              <div className="flex gap-1 bg-bg-gray rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-text-gray'}`}><FiGrid size={16} /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-text-gray'}`}><FiList size={16} /></button>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="text-sm border border-border rounded-lg px-3 py-2 bg-white outline-none hover:border-primary flex items-center justify-between gap-2"
                >
                  <span className="whitespace-nowrap">{sortBy}</span>
                  <FiChevronDown className={`transition-transform flex-shrink-0 ${showSort ? 'rotate-180' : ''}`} />
                </button>

                {showSort && (
                  <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50">
                    <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                      Sắp xếp theo
                    </div>
                    <button
                      onClick={() => { setSortBy('Giá tăng dần'); setShowSort(false); }}
                      className="w-full text-center px-3 py-2 text-sm hover:bg-bg-gray text-text-dark transition-colors"
                    >
                      Giá tăng dần
                    </button>
                    <button
                      onClick={() => { setSortBy('Giá giảm dần'); setShowSort(false); }}
                      className="w-full text-center px-3 py-2 text-sm hover:bg-bg-gray text-text-dark border-t border-border transition-colors"
                    >
                      Giá giảm dần
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
            {sortedAndFiltered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div className="flex justify-center gap-2 mt-10">
            {[1, 2, 3, 4, 5].map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === p ? 'bg-primary text-white' : 'bg-white text-text-gray border border-border hover:border-primary'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
