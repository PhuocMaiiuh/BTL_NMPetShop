import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiFilter, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';

const defaultProducts = [
  { id: 1, name: 'Hạt khô Royal Canin cho chó', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop', price: 110000, originalPrice: 150000, rating: 4, reviews: 12, category: 'Thức ăn cho chó', badge: 'Hot', brand: 'Royal Canin', isBestSelling: true, active: true },
  { id: 2, name: 'Thức ăn ướt cho mèo cá ngừ', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', price: 320000, originalPrice: 380000, rating: 5, reviews: 18, category: 'Thức ăn cho mèo', badge: 'Sale', brand: 'Whiskas', isBestSelling: true, active: true },
  { id: 3, name: 'Pate tươi cho chó con vị gà', image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop', price: 382500, originalPrice: 450000, rating: 4, reviews: 15, category: 'Thức ăn cho chó', badge: 'Sale', brand: 'Pedigree', isBestSelling: true, active: true },
  { id: 4, name: 'Vòng cổ da cao cấp thú cưng', image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=400&h=400&fit=crop', price: 180000, originalPrice: 220000, rating: 5, reviews: 10, category: 'Phụ kiện', badge: 'Hot', brand: 'Royal Canin', isBestSelling: true, active: true },
  { id: 5, name: 'Đồ chơi xương gặm cao su', image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=400&h=400&fit=crop', price: 85000, rating: 4, reviews: 20, category: 'Đồ chơi', brand: 'Pedigree', isBestSelling: true, active: true },
  { id: 6, name: 'Bát ăn inox chống trượt', image: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&h=400&fit=crop', price: 120000, rating: 5, reviews: 7, category: 'Phụ kiện', brand: 'Me-O', isBestSelling: true, active: true },
  { id: 7, name: 'Sữa tắm thảo dược cho mèo', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop', price: 195000, rating: 4, reviews: 11, category: 'Chăm sóc sức khỏe', brand: 'Whiskas', isBestSelling: true, active: true },
  { id: 8, name: 'Cần câu mèo gắn lông vũ', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop', price: 45000, rating: 5, reviews: 25, category: 'Đồ chơi', brand: 'Me-O', isBestSelling: true, active: true },
  { id: 9, name: 'Ổ nằm bông êm ái cho thú cưng', image: 'https://images.unsplash.com/photo-1591946614421-1d977ff89c46?w=400&h=400&fit=crop', price: 450000, originalPrice: 550000, rating: 5, reviews: 14, category: 'Phụ kiện', badge: 'Hot', brand: 'Royal Canin', isBestSelling: true, active: true },
  { id: 10, name: 'Xịt khử mùi vệ sinh chó mèo', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop', price: 135000, rating: 4, reviews: 9, category: 'Chăm sóc sức khỏe', brand: 'Me-O', isBestSelling: true, active: true },
  { id: 11, name: 'Hạt khô cao cấp cho chó trưởng thành', image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop', price: 110000, rating: 4, reviews: 8, category: 'Thức ăn cho chó', brand: 'Royal Canin', active: true },
  { id: 12, name: 'Thức ăn ướt cho mèo vị cá ngừ', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop', price: 320000, rating: 5, reviews: 12, category: 'Thức ăn cho mèo', brand: 'Whiskas', active: true },
];

const mainCategories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'dog-food', label: 'Thức ăn cho chó' },
  { id: 'cat-food', label: 'Thức ăn cho mèo' },
  { id: 'acc', label: 'Phụ kiện' },
  { id: 'toy', label: 'Đồ chơi' },
  { id: 'health', label: 'Chăm sóc sức khỏe' }
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
  { id: 'health-medicine', label: 'Thuốc & Vitamin' },
  { id: 'health-tool', label: 'Dụng cụ cắt tỉa' }
];

const priceRanges = [
  { id: 'price-1', label: 'Dưới 50.000đ', min: 0, max: 49999 },
  { id: 'price-2', label: 'Từ 50.000đ đến 100.000đ', min: 50000, max: 100000 },
  { id: 'price-3', label: 'Từ 100.000đ đến 200.000đ', min: 100001, max: 200000 },
  { id: 'price-4', label: 'Từ 200.000đ đến 400.000đ', min: 200001, max: 400000 },
  { id: 'price-5', label: 'Từ 400.000đ đến 800.000đ', min: 400001, max: 800000 },
  { id: 'price-6', label: 'Từ 800.000đ đến 1 triệu', min: 800001, max: 1000000 },
];

const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nm_petshop_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryParam && !filterParam) {
      navigate('/');
    }
  }, [categoryParam, filterParam, navigate]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Sắp xếp theo');
  const [showSort, setShowSort] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
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

  const handlePriceRangeClick = (rangeId) => {
    setSelectedPriceRanges(prev =>
      prev.includes(rangeId)
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const filtered = products.filter((p) => {
    // If filter=top-selling is active, only show best selling products
    if (filterParam === 'top-selling') {
      return p.isBestSelling;
    }

    if (selectedPriceRanges.length > 0) {
      const isMatch = selectedPriceRanges.some(rangeId => {
        const range = priceRanges.find(r => r.id === rangeId);
        return p.price >= range.min && p.price <= range.max;
      });
      if (!isMatch) return false;
    }

    if (selectedBrands.length > 0) {
      const mainBrands = ['Royal Canin', 'Pedigree', 'Whiskas', 'Me-O'];
      const isSelectedMainBrand = selectedBrands.includes(p.brand);
      const isOtherSelected = selectedBrands.includes('Khác') && !mainBrands.includes(p.brand);

      if (!isSelectedMainBrand && !isOtherSelected) return false;
    }

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
      const matchesMedicine = selectedCategories.includes('Thuốc & Vitamin') && (p.name.toLowerCase().includes('thuốc') || p.name.toLowerCase().includes('vitamin') || p.name.toLowerCase().includes('dinh dưỡng'));
      const matchesTool = selectedCategories.includes('Dụng cụ cắt tỉa') && (p.name.toLowerCase().includes('kéo') || p.name.toLowerCase().includes('tông đơ') || p.name.toLowerCase().includes('lược') || p.name.toLowerCase().includes('kềm') || p.name.toLowerCase().includes('kìm'));

      return matchesDog || matchesCat || matchesMedicine || matchesTool;
    }

    return (selectedCategories.includes('Tất cả') || selectedCategories.includes(p.category));
  }).filter(p => p.active !== false); // Only show active products

  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortBy === 'Giá tăng dần') return a.price - b.price;
    if (sortBy === 'Giá giảm dần') return b.price - a.price;
    return 0;
  });

  const getBreadcrumbLabel = () => {
    if (filterParam === 'top-selling') return 'Sản phẩm bán chạy nhất';
    switch (categoryParam) {
      case 'cho': return 'Sản phẩm cho chó';
      case 'meo': return 'Sản phẩm cho mèo';
      case 'phu-kien': return 'Phụ kiện';
      case 'do-choi': return 'Đồ chơi';
      case 'suc-khoe': return 'Chăm sóc sức khỏe';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <span className="text-text-dark font-medium">{getBreadcrumbLabel()}</span>
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
              <div className="space-y-4">
                {priceRanges.map((range) => (
                  <label key={range.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => handlePriceRangeClick(range.id)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedPriceRanges.includes(range.id)
                      ? 'bg-primary border-primary'
                      : 'border-[#cbd5e1] group-hover:border-primary/50'
                      }`}>
                      {selectedPriceRanges.includes(range.id) && (
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span className="text-[15px] text-[#475569]">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-8 border-t border-border pt-6">
              <h3 className="font-semibold text-lg text-text-dark mb-4">Thương hiệu</h3>
              <div className="space-y-3">
                {['Royal Canin', 'Pedigree', 'Whiskas', 'Me-O', 'Khác'].map(brand => (
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
              <div className="relative min-w-[160px]">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white outline-none hover:border-primary flex items-center justify-between gap-2 transition-all"
                >
                  <span className="whitespace-nowrap">{sortBy}</span>
                  <FiChevronDown className={`transition-transform flex-shrink-0 ${showSort ? 'rotate-180' : ''}`} />
                </button>

                {showSort && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[
                      { id: 'default', label: 'Sắp xếp theo' },
                      { id: 'price-asc', label: 'Giá tăng dần' },
                      { id: 'price-desc', label: 'Giá giảm dần' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.label);
                          setShowSort(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center justify-between
                          ${sortBy === option.label
                            ? 'bg-primary text-white font-medium'
                            : 'text-text-dark hover:bg-bg-gray'
                          } ${option.id !== 'default' ? 'border-t border-gray-50' : ''}`}
                      >
                        <span className="whitespace-nowrap">{option.label}</span>
                        {sortBy === option.label && (
                          <svg className="w-4 h-4 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
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
