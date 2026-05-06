import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const CategoryCard = ({ icon, title, description, link, color }) => {
  // Determine glow color based on bg color class
  const glowMap = {
    'bg-red-500': 'rgba(239,68,68,0.25)',
    'bg-orange-500': 'rgba(249,115,22,0.25)',
    'bg-emerald-500': 'rgba(16,185,129,0.25)',
    'bg-blue-500': 'rgba(59,130,246,0.25)',
    'bg-purple-500': 'rgba(168,85,247,0.25)',
  };
  const glowColor = glowMap[color] || 'rgba(26,60,94,0.25)';

  return (
    <Link
      to={link}
      className="group relative flex flex-col items-center text-center p-8 rounded-3xl transition-all duration-400 cursor-pointer overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${glowColor}`;
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
      }}
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${color} bg-opacity-20 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>

      <h3 className="text-lg font-black text-white mb-2">{title}</h3>
      <p className="text-white/50 text-xs leading-relaxed max-w-[200px] mb-6">{description}</p>
      
      {/* Explore button */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#e85a2b] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        Khám phá ngay
        <FiArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

export default CategoryCard;
