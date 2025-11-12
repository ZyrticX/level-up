import { 
  Zap, 
  Binary, 
  Cpu, 
  Wifi, 
  CircuitBoard,
  Microchip,
  Radio,
  Calculator,
  Dices,
  TrendingUp,
  Atom,
  Magnet,
  Package
} from 'lucide-react';

export type CourseIconType = 
  | 'electrical-engineering'
  | 'digital-systems'
  | 'computer-organization'
  | 'computer-networks'
  | 'electronics'
  | 'semiconductors'
  | 'signal-processing'
  | 'mathematics'
  | 'probability'
  | 'stochastic-models'
  | 'mechanics'
  | 'electricity-magnetism'
  | 'general';

export const courseIcons = {
  'electrical-engineering': Zap,
  'digital-systems': Binary,
  'computer-organization': Cpu,
  'computer-networks': Wifi,
  'electronics': CircuitBoard,
  'semiconductors': Microchip,
  'signal-processing': Radio,
  'mathematics': Calculator,
  'probability': Dices,
  'stochastic-models': TrendingUp,
  'mechanics': Atom,
  'electricity-magnetism': Magnet,
  'general': Package,
};

export const courseIconLabels: Record<CourseIconType, string> = {
  'electrical-engineering': 'הנדסת חשמל',
  'digital-systems': 'מערכות ספרתיות',
  'computer-organization': 'ארגון המחשב / מבנה מעבד',
  'computer-networks': 'רשתות מחשבים',
  'electronics': 'אלקטרוניקה',
  'semiconductors': 'מוליכים למחצה',
  'signal-processing': 'עיבוד אותות',
  'mathematics': 'מתמטיקה',
  'probability': 'הסתברות',
  'stochastic-models': 'מודלים סטוכסטיים',
  'mechanics': 'מכניקה',
  'electricity-magnetism': 'חשמל ומגנטיות',
  'general': 'כללי',
};

export const getCourseIcon = (iconType: CourseIconType) => {
  return courseIcons[iconType] || courseIcons.general;
};

export const getCourseIconLabel = (iconType: CourseIconType) => {
  return courseIconLabels[iconType] || courseIconLabels.general;
};
