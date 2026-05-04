import { Link } from 'react-router-dom';

const combos = [
  {
    id: 1,
    title: 'Combo Răng Miệng',
    desc: 'Giảm 20% bộ bàn chải & nước súc miệng.',
    image: '/Combo.png',
    color: 'from-emerald-600 to-emerald-400',
    path: '/san-pham'
  },
  {
    id: 2,
    title: 'Combo Ăn Ngon',
    desc: 'Tặng ngay bát ăn khi mua 2 bao hạt.',
    image: '/Combo.png',
    color: 'from-orange-500 to-amber-400',
    path: '/san-pham'
  },
  {
    id: 3,
    title: 'Combo Spa Tẩy Tế',
    desc: 'Sữa tắm & Lược chải lông cao cấp.',
    image: '/Combo.png',
    color: 'from-blue-600 to-cyan-400',
    path: '/san-pham'
  },
  {
    id: 4,
    title: 'Combo Vui Chơi',
    desc: 'Mua 3 tặng 1 các loại đồ chơi dây thừng.',
    image: '/Combo.png',
    color: 'from-purple-600 to-pink-400',
    path: '/san-pham'
  }
];

const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl font-bold text-text-dark mb-8">Top 4 các combo siêu hời</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {combos.map((combo) => (
          <div 
            key={combo.id}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${combo.color} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            <div className="flex flex-col h-full">
              {/* Text Part */}
              <div className="p-5 flex-1">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {combo.title}
                </h3>
                <p className="text-white/80 text-xs mb-4 line-clamp-2">
                  {combo.desc}
                </p>
                <Link
                  to={combo.path}
                  className="inline-flex items-center text-xs font-semibold text-white group/btn"
                >
                  Mua ngay
                  <svg className="w-3 h-3 ml-1 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Image Part */}
              <div className="h-28 relative overflow-hidden flex items-center justify-center p-2 bg-white/10">
                <img
                  src={combo.image}
                  alt={combo.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;
