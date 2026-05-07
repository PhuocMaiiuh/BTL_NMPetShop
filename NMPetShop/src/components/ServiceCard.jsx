import { FiArrowRight } from 'react-icons/fi';
import { MdPets, MdSpa, MdHotel, MdMedicalServices } from 'react-icons/md';

const iconMap = {
  MdPets: <MdPets size={24} />,
  MdSpa: <MdSpa size={24} />,
  MdHotel: <MdHotel size={24} />,
  MdMedicalServices: <MdMedicalServices size={24} />,
};

const ServiceCard = ({ title, description, price, image, icon, category }) => {
  return (
    <div className="group relative rounded-[2.5rem] overflow-hidden bg-[#0a1526] border border-white/5 transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e1a] via-transparent to-transparent opacity-80" />
        
        {/* Floating Icon */}
        <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-xl group-hover:bg-[#e85a2b] group-hover:text-white transition-colors duration-300">
          {iconMap[icon] || <MdPets size={24} />}
        </div>
      </div>

      {/* Content */}
      <div className="p-7">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-white group-hover:text-[#e85a2b] transition-colors">{title}</h3>
          <span className="px-3 py-1 rounded-full bg-[#e85a2b]/10 text-[#e85a2b] text-[10px] font-bold uppercase tracking-wider">
            {category}
          </span>
        </div>
        <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-0.5">Giá từ</p>
            <p className="text-lg font-black text-white">{price}</p>
          </div>
          <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-gradient-to-r group-hover:from-[#e85a2b] group-hover:to-[#f59e0b] group-hover:border-transparent transition-all duration-300">
            <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 border-2 border-[#e85a2b]/0 rounded-[2.5rem] transition-all duration-500 group-hover:border-[#e85a2b]/30 pointer-events-none" />
    </div>
  );
};

export default ServiceCard;
