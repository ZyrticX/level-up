import { 
  Zap, 
  Binary, 
  Cpu, 
  Network, 
  CircuitBoard, 
  Microchip, 
  Radio, 
  Calculator, 
  Dices, 
  GitBranch, 
  Atom, 
  Cog, 
  Magnet, 
  BookOpen,
  LucideIcon
} from 'lucide-react';

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

interface CourseIconConfig {
  icon: LucideIcon;
  label: string;
  labelHe: string;
}

export const courseIconConfig: Record<CourseIconCategory, CourseIconConfig> = {
  electrical_engineering: {
    icon: Zap,
    label: 'Electrical Engineering',
    labelHe: 'הנדסת חשמל'
  },
  digital_systems: {
    icon: Binary,
    label: 'Digital Systems',
    labelHe: 'מערכות ספרתיות'
  },
  computer_organization: {
    icon: Cpu,
    label: 'Computer Organization',
    labelHe: 'ארגון/מבנה המחשב'
  },
  computer_networks: {
    icon: Network,
    label: 'Computer Networks',
    labelHe: 'רשתות מחשבים'
  },
  electronics: {
    icon: CircuitBoard,
    label: 'Electronics',
    labelHe: 'אלקטרוניקה'
  },
  semiconductors: {
    icon: Microchip,
    label: 'Semiconductors',
    labelHe: 'מוליכים למחצה'
  },
  signal_processing: {
    icon: Radio,
    label: 'Signal Processing',
    labelHe: 'עיבוד אותות'
  },
  mathematics: {
    icon: Calculator,
    label: 'Mathematics',
    labelHe: 'מתמטיקה'
  },
  probability: {
    icon: Dices,
    label: 'Probability',
    labelHe: 'הסתברות'
  },
  stochastic_models: {
    icon: GitBranch,
    label: 'Stochastic Models',
    labelHe: 'מודלים סטוכסטיים'
  },
  physics: {
    icon: Atom,
    label: 'Physics',
    labelHe: 'פיזיקה'
  },
  mechanics: {
    icon: Cog,
    label: 'Mechanics',
    labelHe: 'מכניקה'
  },
  magnetism: {
    icon: Magnet,
    label: 'Magnetism',
    labelHe: 'מגנטיות וחשמל'
  },
  general: {
    icon: BookOpen,
    label: 'General',
    labelHe: 'כללי'
  }
};

export const getCourseIcon = (category: CourseIconCategory = 'general') => {
  return courseIconConfig[category] || courseIconConfig.general;
};
