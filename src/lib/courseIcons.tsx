// Course icon categories matching the database enum (using underscores)
export type CourseIconCategory = 
  | 'electrical_engineering'
  | 'digital_systems'
  | 'computer_organization'
  | 'computer_networks'
  | 'electronics'
  | 'semiconductors'
  | 'signal_processing'
  | 'mathematics'
  | 'probability'
  | 'stochastic_models'
  | 'physics'
  | 'mechanics'
  | 'magnetism'
  | 'general';

// Mapping from category to custom SVG icon path
export const courseIconPaths: Record<CourseIconCategory, string> = {
  'electrical_engineering': '/icons/electronic-circuit.svg',
  'digital_systems': '/icons/digital-systems.svg',
  'computer_organization': '/icons/processor.svg',
  'computer_networks': '/icons/computer-network.svg',
  'electronics': '/icons/electronics.svg',
  'semiconductors': '/icons/semiconductors.svg',
  'signal_processing': '/icons/signal-proccesing.svg',
  'mathematics': '/icons/math.svg',
  'probability': '/icons/probability.svg',
  'stochastic_models': '/icons/Stochastic-proccess.svg',
  'physics': '/icons/mechanics.svg',
  'mechanics': '/icons/mechanics.svg',
  'magnetism': '/icons/electricity-magnetism.svg',
  'general': '/icons/general.svg',
};

// Hebrew labels for each category
export const courseIconLabels: Record<CourseIconCategory, string> = {
  'electrical_engineering': 'הנדסת חשמל',
  'digital_systems': 'מערכות ספרתיות',
  'computer_organization': 'ארגון המחשב / מבנה מעבד',
  'computer_networks': 'רשתות מחשבים',
  'electronics': 'אלקטרוניקה',
  'semiconductors': 'מוליכים למחצה',
  'signal_processing': 'עיבוד אותות',
  'mathematics': 'מתמטיקה',
  'probability': 'הסתברות',
  'stochastic_models': 'מודלים סטוכסטיים',
  'physics': 'פיזיקה',
  'mechanics': 'מכניקה',
  'magnetism': 'חשמל ומגנטיות',
  'general': 'כללי',
};

// Get the icon path for a category
export const getCourseIconPath = (category: CourseIconCategory): string => {
  return courseIconPaths[category] || courseIconPaths.general;
};

// Get the Hebrew label for a category
export const getCourseIconLabel = (category: CourseIconCategory): string => {
  return courseIconLabels[category] || courseIconLabels.general;
};

// Legacy export for backwards compatibility (deprecated - use CourseIconCategory)
export type CourseIconType = CourseIconCategory;
