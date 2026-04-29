import { GiDogBowl, GiBalloonDog, GiCat } from 'react-icons/gi';
import { MdPets } from 'react-icons/md';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import PromoBanner from '../components/PromoBanner';
import { Link } from 'react-router-dom';

const sampleProducts = [
  {
    id: 1,
    name: 'Hạt khô Royal Canin cho chó',
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop',
    price: 110000,
    originalPrice: 150000,
    rating: 4,
    reviews: 12,
    category: 'Thức ăn cho chó',
    badge: 'Sale',
  },
  {
    id: 2,
    name: 'Thức ăn ướt cho mèo cá ngừ',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
    price: 320000,
    originalPrice: 380000,
    rating: 5,
    reviews: 18,
    category: 'Thức ăn cho mèo',
    badge: 'Sale',
  },
  {
    id: 3,
    name: 'Pate tươi cho chó con vị gà',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
    price: 382500,
    originalPrice: 450000,
    rating: 4,
    reviews: 15,
    category: 'Thức ăn cho chó',
    badge: 'Sale',
  },
  {
    id: 4,
    name: 'Vòng cổ da cao cấp thú cưng',
    image: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=400&h=400&fit=crop',
    price: 180000,
    originalPrice: 220000,
    rating: 5,
    reviews: 10,
    category: 'Phụ kiện',
    badge: 'Sale',
  },
];

const categories = [
  {
    icon: <GiDogBowl size={24} className="text-white" />,
    title: 'Thức ăn',
    description: 'Cung cấp dinh dưỡng cho thú cưng với các loại thức ăn hàng đầu.',
    link: '/san-pham?category=thuc-an',
    color: 'bg-primary',
  },
  {
    icon: <GiBalloonDog size={24} className="text-white" />,
    title: 'Đồ chơi',
    description: 'Bộ sưu tập đồ chơi vui nhộn và an toàn.',
    link: '/san-pham?category=do-choi',
    color: 'bg-orange-500',
  },
  {
    icon: <MdPets size={24} className="text-white" />,
    title: 'Phụ kiện',
    description: 'Vòng cổ, dây dẫn và quần áo dễ thương cho bé.',
    link: '/san-pham?category=phu-kien',
    color: 'bg-emerald-500',
  },
];

const HomePage = () => {
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold text-center text-text-dark mb-10">Danh mục nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-text-dark">Sản phẩm nổi bật</h2>
          <Link
            to="/san-pham"
            className="text-sm text-primary hover:text-primary-light font-medium transition-colors"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />
    </div>
  );
};

export default HomePage;
