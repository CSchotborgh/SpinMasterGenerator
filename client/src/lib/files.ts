import type { WheelConfig, ColorScheme } from "../pages/Home";

export async function importConfig(file: File): Promise<WheelConfig> {
  const text = await file.text();
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parseCsv(text);
    case 'txt':
      return parseTxt(text);
    case 'xls':
    case 'xlsx':
      return parseXls(text);
    default:
      throw new Error('Unsupported file format');
  }
}

export async function exportConfig(config: WheelConfig, format: 'csv' | 'txt' | 'xls') {
  let content: string;
  let mimeType: string;
  let extension: string;

  switch (format) {
    case 'csv':
      content = generateCsv(config);
      mimeType = 'text/csv';
      extension = 'csv';
      break;
    case 'txt':
      content = generateTxt(config);
      mimeType = 'text/plain';
      extension = 'txt';
      break;
    case 'xls':
      content = generateXls(config);
      mimeType = 'application/vnd.ms-excel';
      extension = 'xls';
      break;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wheel-config.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parseCsv(text: string): WheelConfig {
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  const values = lines[1].split(',');
  
  const slices = parseInt(values[headers.indexOf('slices')]);
  return {
    slices,
    circumference: parseInt(values[headers.indexOf('circumference')]),
    randomSizes: values[headers.indexOf('randomSizes')] === 'true',
    spinSpeed: parseFloat(values[headers.indexOf('spinSpeed')]),
    spinDuration: parseFloat(values[headers.indexOf('spinDuration')]),
    startRamp: parseFloat(values[headers.indexOf('startRamp')]),
    endRamp: parseFloat(values[headers.indexOf('endRamp')]),
    friction: parseFloat(values[headers.indexOf('friction')] || '3.5'),
    velocityVariation: parseFloat(values[headers.indexOf('velocityVariation')] || '0.2'),
    minVelocity: parseFloat(values[headers.indexOf('minVelocity')] || '0.1'),
    colorScheme: (values[headers.indexOf('colorScheme')] || 'default') as ColorScheme,
    customColors: JSON.parse(values[headers.indexOf('customColors')] || '[]'),
    sliceLabels: JSON.parse(values[headers.indexOf('sliceLabels')] || '[]'),
    manualRotation: parseFloat(values[headers.indexOf('manualRotation')] || '0'),
    textRotations: JSON.parse(values[headers.indexOf('textRotations')] || '[]'),
    textVertical: JSON.parse(values[headers.indexOf('textVertical')] || '[]'),
    sliceSizes: Array(slices).fill(2 * Math.PI / slices),
    fontSize: Array(slices).fill(0),
    textFontStyle: Array(slices).fill('proportional'),
    textKerning: Array(slices).fill(0),
    verticalKerning: Array(slices).fill(0),
    hubSize: parseFloat(values[headers.indexOf('hubSize')] || '50'),
    hubImage: values[headers.indexOf('hubImage')] || null,
    hubSpinsWithWheel: values[headers.indexOf('hubSpinsWithWheel')] === 'true',
    arrowRadius: parseFloat(values[headers.indexOf('arrowRadius')] || '0'),
  };
}

function parseTxt(text: string): WheelConfig {
  const lines = text.split('\n');
  const config: any = {};
  
  lines.forEach(line => {
    const [key, value] = line.split(':').map(s => s.trim());
    config[key] = key === 'randomSizes' ? value === 'true' : parseFloat(value);
  });

  return config as WheelConfig;
}

function parseXls(text: string): WheelConfig {
  // For this example, we'll parse it as CSV
  // In a real implementation, you'd use a proper XLS parser library
  return parseCsv(text);
}

function generateCsv(config: WheelConfig): string {
  const headers = Object.keys(config).join(',');
  const values = Object.values(config).join(',');
  return `${headers}\n${values}`;
}

function generateTxt(config: WheelConfig): string {
  return Object.entries(config)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}

function generateXls(config: WheelConfig): string {
  // For this example, we'll generate CSV format
  // In a real implementation, you'd use a proper XLS generator library
  return generateCsv(config);
}
