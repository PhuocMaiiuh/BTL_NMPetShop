import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FiGrid, FiList, FiChevronDown, FiLoader } from 'react-icons/fi';
import { fetchProducts, fetchProductMeta } from '../services/productApi';

const VISIBLE_LIMIT = 5;
const ITEMS_PER_PAGE = 12;

const priceRanges = [
  { id: 'price-1', label: 'Dưới 50.000đ',        min: 0,      max: 49999   },
  { id: 'price-2', label: '50.000đ – 100.000đ',  min: 50000,  max: 100000  },
  { id: 'price-3', label: '100.000đ – 200.000đ', min: 100001, max: 200000  },
  { id: 'price-4', label: '200.000đ – 400.000đ', min: 200001, max: 400000  },
  { id: 'price-5', label: '400.000đ – 800.000đ', min: 400001, max: 800000  },
  { id: 'price-6', label: '800.000đ – 1 triệu',  min: 800001, max: 1000000 },
];

const breadcrumbLabels = {
  cho:       'Sản phẩm cho chó',
  meo:       'Sản phẩm cho mèo',
  'phu-kien': 'Phụ kiện',
  'do-choi':  'Đồ chơi',
  'suc-khoe': 'Chăm sóc sức khỏe',
};

// ── Sub-components ────────────────────────────────────────────
const FilterCheckbox = ({ label, checked, onClick, bold = false }) => (
  <label className="flex items-center gap-3 cursor-pointer group" onClick={onClick}>
    <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
      checked ? 'bg-[#2962ff] border-[#2962ff]' : 'border-[#cbd5e1] group-hover:border-[#2962ff]/50'
    }`}>
      {checked && (
        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
    <span className={`text-[14px] text-[#475569] leading-tight ${bold ? 'font-medium' : ''}`}>{label}</span>
  </label>
);

const ExpandBtn = ({ expanded, onToggle, extra }) => (
  <button onClick={onToggle} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-light font-medium transition-colors mt-1">
    <FiChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
    {expanded ? 'Rút gọn' : `Xem thêm (${extra})`}
  </button>
);

// ── Main Component ────────────────────────────────────────────
const ProductListPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam   = searchParams.get('filter');
  const navigate      = useNavigate();

  // ── Filter state ──
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands,     setSelectedBrands]     = useState([]);
  const [selectedPrices,     setSelectedPrices]     = useState([]);
  const [currentPage,        setCurrentPage]        = useState(1);
  const [sortBy,             setSortBy]             = useState('');
  const [showSort,           setShowSort]           = useState(false);
  const [showAllCats,        setShowAllCats]        = useState(false);
  const [showAllBrands,      setShowAllBrands]      = useState(false);

  // ── Data state ──
  const [products,   setProducts]   = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // ── Meta state (categories & brands sidebar) ──
  const [availableCats,   setAvailableCats]   = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  useEffect(() => {
    if (!categoryParam && !filterParam) navigate('/');
  }, [categoryParam, filterParam, navigate]);

  // Reset on route change
  useEffect(() => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPrices([]);
    setCurrentPage(1);
    setSortBy('');
    setShowAllCats(false);
    setShowAllBrands(false);
  }, [categoryParam, filterParam]);

  // Fetch sidebar meta (categories + brands)
  useEffect(() => {
    fetchProductMeta({ category: categoryParam, filter: filterParam })
      .then(({ categories, brands }) => {
        setAvailableCats(categories);
        setAvailableBrands(brands);
      })
      .catch(() => {});
  }, [categoryParam, filterParam]);

  // Compute combined price range from selected checkboxes
  const { priceMin, priceMax } = useMemo(() => {
    if (!selectedPrices.length) return { priceMin: null, priceMax: null };
    const ranges = selectedPrices.map(id => priceRanges.find(r => r.id === id)).filter(Boolean);
    return {
      priceMin: Math.min(...ranges.map(r => r.min)),
      priceMax: Math.max(...ranges.map(r => r.max)),
    };
  }, [selectedPrices]);

  // Fetch products from API
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sortMap = { 'Giá tăng dần': 'price_asc', 'Giá giảm dần': 'price_desc' };
      const data = await fetchProducts({
        category: categoryParam,
        filter: filterParam,
        subCategories: selectedCategories,
        brands: selectedBrands,
        priceMin,
        priceMax,
        page: currentPage,
        limit: filterParam === 'top-selling' ? 10 : ITEMS_PER_PAGE,
        sort: sortMap[sortBy] || '',
      });
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [categoryParam, filterParam, selectedCategories, selectedBrands, priceMin, priceMax, currentPage, sortBy]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // ── Handlers ──
  const handleCatClick = cat => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleBrandClick = brand => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handlePriceClick = rid => {
    setSelectedPrices(prev =>
      prev.includes(rid) ? prev.filter(x => x !== rid) : [...prev, rid]
    );
    setCurrentPage(1);
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPrices([]);
    setSortBy('');
    setCurrentPage(1);
  };

  const hasFilters = selectedCategories.length || selectedBrands.length || selectedPrices.length;

  const filteredAvailableCats = useMemo(() => {
    const SUFFIX_MAP = {
      cho: '(Sản phẩm cho Chó)',
      meo: '(Sản phẩm cho Mèo)',
      'phu-kien': '(Phụ kiện)',
      'do-choi': '(Đồ chơi)',
      'suc-khoe': '(Chăm sóc sức khỏe)'
    };
    const CATEGORY_ORDER = [
      'Thức ăn hạt',
      'Pate & Đồ hộp',
      'Sữa tắm & Vệ sinh',
      'Vòng cổ & Dây dắt',
      'Bát ăn & Bình nước',
      'Giường nệm & Chuồng',
      'Túi vận chuyển & Lồng',
      'Phụ kiện chung',
      'Đồ chơi nhai gặm',
      'Cần câu & Bóng',
      'Bàn cào móng',
      'Đồ chơi chung',
      'Thuốc & Vitamin',
      'Dụng cụ cắt tỉa',
      'Vệ sinh & Khử mùi',
      'Chăm sóc & Y tế',
      'Phụ kiện',
      'Đồ chơi',
      'Chăm sóc khác'
    ];

    const suffix = SUFFIX_MAP[categoryParam];
    let cats = availableCats;
    if (suffix) {
      cats = availableCats.filter(cat => cat.includes(suffix));
    }

    // Custom sort based on CATEGORY_ORDER
    return [...cats].sort((a, b) => {
      const nameA = a.split(' (')[0];
      const nameB = b.split(' (')[0];
      const indexA = CATEGORY_ORDER.indexOf(nameA);
      const indexB = CATEGORY_ORDER.indexOf(nameB);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [availableCats, categoryParam]);

  const visibleCats   = filteredAvailableCats;
  const visibleBrands = showAllBrands ? availableBrands : availableBrands.slice(0, VISIBLE_LIMIT);

  // Smart pagination
  const pageNums = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, currentPage]);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) if (i > 0 && i <= totalPages) pages.add(i);
    return [...pages].sort((a, b) => a - b);
  }, [totalPages, currentPage]);

  const gotoPage = p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-gray mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <span className="text-text-dark font-medium">
          {filterParam === 'top-selling' ? 'Top 10 Sản phẩm bán chạy' : breadcrumbLabels[categoryParam] || ''}
        </span>
      </nav>

      <div className="flex gap-8">
        {/* ─── Sidebar ─── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">

          {/* Clear filters */}

          {/* Danh mục */}
          <div className="mb-8">
            <h3 className="font-semibold text-xl text-text-dark mb-5">Danh mục</h3>
            <div className="space-y-3">
              <FilterCheckbox
                label="Tất cả"
                checked={selectedCategories.length === 0}
                onClick={clearAll}
                bold
              />
              {visibleCats.map(cat => (
                <FilterCheckbox 
                  key={cat} 
                  label={cat.replace(/\s*\(.*?\)$/, '')} 
                  checked={selectedCategories.includes(cat)} 
                  onClick={() => handleCatClick(cat)} 
                />
              ))}
            </div>
          </div>

          {/* Khoảng giá */}
          <div className="mb-8 border-t border-border pt-6">
            <h3 className="font-semibold text-lg text-text-dark mb-4">Khoảng giá</h3>
            <div className="space-y-3">
              {priceRanges.map(r => (
                <FilterCheckbox key={r.id} label={r.label} checked={selectedPrices.includes(r.id)} onClick={() => handlePriceClick(r.id)} />
              ))}
            </div>
          </div>

          {/* Thương hiệu */}
          <div className="mb-8 border-t border-border pt-6">
            <h3 className="font-semibold text-lg text-text-dark mb-4">Thương hiệu</h3>
            <div className="space-y-3">
              {visibleBrands.map(brand => (
                <FilterCheckbox key={brand} label={brand} checked={selectedBrands.includes(brand)} onClick={() => handleBrandClick(brand)} />
              ))}
              {availableBrands.length > VISIBLE_LIMIT && (
                <ExpandBtn expanded={showAllBrands} onToggle={() => setShowAllBrands(v => !v)} extra={availableBrands.length - VISIBLE_LIMIT} />
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary to-amber-400 rounded-2xl p-5 text-white">
            <h4 className="font-bold text-sm mb-1">Ưu đãi đặc biệt</h4>
            <p className="text-xs opacity-90 mb-3">Giảm 20% cho đơn hàng đầu tiên</p>
            <button className="px-4 py-2 bg-white text-secondary font-semibold rounded-lg text-xs">Áp dụng ngay</button>
          </div>
        </aside>

        {/* ─── Main ─── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <p className="text-sm text-text-gray">
              {loading ? 'Đang tải...' : <>Hiển thị <span className="font-semibold text-text-dark">{total}</span> sản phẩm</>}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-bg-gray rounded-lg p-1">
                <button onClick={() => {}} className="p-2 rounded-md bg-white shadow-sm text-primary"><FiGrid size={16} /></button>
                <button onClick={() => {}} className="p-2 rounded-md text-text-gray"><FiList size={16} /></button>
              </div>
              <div className="relative min-w-[160px]">
                <button onClick={() => setShowSort(v => !v)} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white hover:border-primary flex items-center justify-between gap-2 transition-all">
                  <span className="whitespace-nowrap">{sortBy || 'Sắp xếp theo'}</span>
                  <FiChevronDown className={`transition-transform flex-shrink-0 ${showSort ? 'rotate-180' : ''}`} />
                </button>
                {showSort && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-border overflow-hidden z-50">
                    {['Sắp xếp theo', 'Giá tăng dần', 'Giá giảm dần'].map(opt => (
                      <button key={opt} onClick={() => { setSortBy(opt === 'Sắp xếp theo' ? '' : opt); setShowSort(false); setCurrentPage(1); }}
                        className={`w-full text-left px-4 py-3 text-sm transition-all ${(sortBy || 'Sắp xếp theo') === opt ? 'bg-primary text-white font-medium' : 'text-text-dark hover:bg-bg-gray'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* States */}
          {error && (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">⚠️</p>
              <p className="text-lg font-medium text-red-500">Không thể kết nối server</p>
              <p className="text-sm text-text-gray mt-1">{error}</p>
              <button onClick={loadProducts} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg text-sm">Thử lại</button>
            </div>
          )}

          {loading && !error && (
            <div className="flex justify-center items-center py-32">
              <FiLoader size={32} className="animate-spin text-primary" />
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-20 text-text-gray">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-medium">Không tìm thấy sản phẩm phù hợp</p>
              <p className="text-sm mt-1">Thử thay đổi bộ lọc để xem thêm sản phẩm</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {products.map(p => <ProductCard key={p._id || p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-10">
              <button disabled={currentPage === 1} onClick={() => gotoPage(currentPage - 1)}
                className="px-3 py-2 rounded-lg text-sm border border-border bg-white text-text-gray hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                ←
              </button>
              {pageNums.map((p, i) => {
                const prev = pageNums[i - 1];
                return (
                  <span key={p} className="flex items-center gap-1.5">
                    {prev && p - prev > 1 && <span className="text-text-gray px-1">…</span>}
                    <button onClick={() => gotoPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === p ? 'bg-primary text-white' : 'bg-white text-text-gray border border-border hover:border-primary'}`}>
                      {p}
                    </button>
                  </span>
                );
              })}
              <button disabled={currentPage === totalPages} onClick={() => gotoPage(currentPage + 1)}
                className="px-3 py-2 rounded-lg text-sm border border-border bg-white text-text-gray hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
