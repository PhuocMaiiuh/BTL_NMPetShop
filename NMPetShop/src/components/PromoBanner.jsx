import { Link } from 'react-router-dom';

const PromoBanner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-5 items-center">
          {/* Text */}
          <div className="md:col-span-3 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Combo chăm sóc răng miệng
            </h2>
            <p className="text-emerald-100 text-sm mb-2">
              Giảm 20% khi mua combo bàn chải sạch, nước súc miệng chuyên dụng.
            </p>
            <p className="text-emerald-200 text-xs mb-6">
              Giúp bạn cưỡi cưới thêm thêm thoải mái và khỏe mạnh.
            </p>
            <Link
              to="/san-pham"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-emerald-700 font-semibold rounded-lg text-sm hover:bg-emerald-50 transition-colors duration-200"
            >
              Mua ngay
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Image */}
          <div className="md:col-span-2 relative h-48 md:h-full">
            <img
              src="/Combo.png"
              alt="Combo chăm sóc"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
