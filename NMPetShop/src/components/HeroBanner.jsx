import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const banners = [
  '/Banner1.png',
  '/Banner2.png',
  '/Banner3.png',
  '/Banner4.png'
];

const HeroBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl group">
        
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-[320px] sm:h-[420px] md:h-[520px] lg:h-[620px] xl:h-[680px]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <img 
              key={index}
              src={banner} 
              alt={`NM Pet Shop Banner ${index + 1}`} 
              className="w-full h-full object-cover object-top flex-shrink-0"
            />
          ))}
        </div>

        {/* Navigation Arrows (visible on hover) */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
        >
          <FiChevronLeft size={24} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80 w-2.5'
              }`}
            />
          ))}
        </div>

        {/* Container for Buttons (Overlaying all slides) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute right-8 sm:right-12 md:right-20 lg:right-32 bottom-12 sm:bottom-16 md:bottom-28 lg:bottom-32 flex flex-col sm:flex-row gap-3 pointer-events-auto translate-y-[12px]">
            <Link
              to="/san-pham"
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-[#e85a2b] hover:bg-[#d64e22] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm whitespace-nowrap text-center"
            >
              Khám Phá Ngay
            </Link>
            <Link
              to="/san-pham"
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-white hover:bg-gray-50 text-[#e85a2b] font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-sm whitespace-nowrap text-center"
            >
              Mua Sắm Ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
