import { Link } from 'react-router-dom';

const CategoryCard = ({ icon, title, description, link, color }) => {
  return (
    <Link
      to={link}
      className="group flex flex-col items-center text-center p-6 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${color}`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-sm text-text-dark mb-1">{title}</h3>
      <p className="text-xs text-text-gray leading-relaxed">{description}</p>
      <span className="text-xs text-primary font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Xem thêm →
      </span>
    </Link>
  );
};

export default CategoryCard;
