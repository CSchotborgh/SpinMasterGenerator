import type { WheelConfig } from "../pages/Home";

export interface WheelTemplate {
  id: string;
  name: string;
  description: string;
  config: Partial<WheelConfig>;
  category: 'game' | 'education' | 'business' | 'custom';
}

export const predefinedTemplates: WheelTemplate[] = [
  {
    id: 'basic-8',
    name: 'Basic 8-Slice',
    description: 'A simple wheel with 8 equal slices',
    category: 'game',
    config: {
      slices: 8,
      circumference: 500,
      randomSizes: false,
      colorScheme: 'default'
    }
  },
  {
    id: 'random-12',
    name: 'Random 12-Slice',
    description: 'A wheel with 12 randomly sized slices',
    category: 'game',
    config: {
      slices: 12,
      circumference: 600,
      randomSizes: true,
      colorScheme: 'neon'
    }
  },
  {
    id: 'education-topics',
    name: 'Education Topics',
    description: 'A wheel for selecting educational topics',
    category: 'education',
    config: {
      slices: 6,
      circumference: 500,
      randomSizes: false,
      colorScheme: 'pastel',
      sliceLabels: ['Math', 'Science', 'History', 'Literature', 'Art', 'Music'],
      textRotations: Array(6).fill(0),
      textVertical: Array(6).fill(false)
    }
  },
  {
    id: 'business-decisions',
    name: 'Business Decisions',
    description: 'A wheel for making business decisions',
    category: 'business',
    config: {
      slices: 6,
      circumference: 500,
      randomSizes: false,
      colorScheme: 'monochrome',
      sliceLabels: ['Approve', 'Reject', 'Review', 'Discuss', 'Delegate', 'Postpone'],
      textRotations: Array(6).fill(0),
      textVertical: Array(6).fill(false)
    }
  }
];

export function applyTemplate(currentConfig: WheelConfig, template: WheelTemplate): WheelConfig {
  const newConfig = { ...currentConfig };
  
  // Apply template configuration
  Object.entries(template.config).forEach(([key, value]) => {
    if (value !== undefined) {
      (newConfig as any)[key] = value;
    }
  });

  // Ensure arrays are properly sized
  const slices = template.config.slices || currentConfig.slices;
  newConfig.customColors = Array(slices).fill(null);
  newConfig.sliceSizes = Array(slices).fill(2 * Math.PI / slices);
  
  // Only initialize if not provided in template
  if (!template.config.sliceLabels) {
    newConfig.sliceLabels = Array(slices).fill('');
  }
  if (!template.config.textRotations) {
    newConfig.textRotations = Array(slices).fill(0);
  }
  if (!template.config.textVertical) {
    newConfig.textVertical = Array(slices).fill(false);
  }
  newConfig.fontSize = Array(slices).fill(0);
  newConfig.textFontStyle = Array(slices).fill('proportional');
  newConfig.textKerning = Array(slices).fill(0);
  newConfig.verticalKerning = Array(slices).fill(0);

  return newConfig;
}

export function createCustomTemplate(
  name: string,
  description: string,
  config: WheelConfig
): WheelTemplate {
  return {
    id: `custom-${Date.now()}`,
    name,
    description,
    category: 'custom',
    config
  };
}
