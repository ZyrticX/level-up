import { CourseIconCategory, getCourseIconPath } from '@/lib/courseIcons';

interface CourseIconProps {
  category?: CourseIconCategory;
  customIconUrl?: string | null;
  size?: number;
  className?: string;
}

const CourseIcon = ({ 
  category = 'general', 
  customIconUrl, 
  size = 48, 
  className = '' 
}: CourseIconProps) => {
  // If custom icon URL is provided, use it; otherwise use the category icon path
  const iconUrl = customIconUrl || getCourseIconPath(category);
  
  return (
    <img 
      src={iconUrl} 
      alt="Course icon" 
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default CourseIcon;
