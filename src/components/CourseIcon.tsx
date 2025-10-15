import { CourseIconCategory, getCourseIcon } from '@/lib/courseIcons';

interface CourseIconProps {
  category?: CourseIconCategory;
  customIconUrl?: string | null;
  size?: number;
  className?: string;
}

const CourseIcon = ({ category = 'general', customIconUrl, size = 48, className = '' }: CourseIconProps) => {
  // If custom icon URL is provided, use it
  if (customIconUrl) {
    return (
      <img 
        src={customIconUrl} 
        alt="Course icon" 
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // Otherwise use the category icon
  const { icon: Icon } = getCourseIcon(category);
  
  return (
    <Icon 
      size={size} 
      className={`text-primary ${className}`}
      strokeWidth={1.5}
    />
  );
};

export default CourseIcon;
