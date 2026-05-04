import { Link } from 'react-router-dom';

const CategoryCard = ({ icon, title, description, link, color }) => {
  return (
    <Link
      to={link}
      className="group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-border transition-all duration-300"
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-xl ${color}`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-lg text-text-dark mb-2 transition-colors group-hover:text-primary">{title}</h3>
      <p className="text-sm text-text-gray leading-relaxed">{description}</p>
      <span className="text-sm text-primary font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        Khám phá ngay →
      </span>
    </Link>
  );
};

export default CategoryCard;
