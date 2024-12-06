import type { WheelConfig } from "../pages/Home";

export function renderWheel(
  ctx: CanvasRenderingContext2D,
  config: WheelConfig,
  rotation: number = 0
) {
  const { circumference, slices, randomSizes } = config;
  const center = circumference / 2;
  const radius = center - 10;

  // Clear canvas
  ctx.clearRect(0, 0, circumference, circumference);
  
  // Set up wheel transform
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  // Generate slice sizes
  const sliceSizes = Array(slices).fill(2 * Math.PI / slices);
  if (randomSizes) {
    const total = sliceSizes.reduce((a, b) => a + b);
    sliceSizes.forEach((_, i) => {
      sliceSizes[i] *= 0.5 + Math.random();
    });
    const newTotal = sliceSizes.reduce((a, b) => a + b);
    sliceSizes.forEach((_, i) => {
      sliceSizes[i] *= total / newTotal;
    });
  }

  // Color schemes
  const colorSchemes = {
    default: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
    ],
    pastel: [
      '#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA',
      '#FFB3F7', '#B3FFEC', '#B3D9FF', '#FFC9B3'
    ],
    neon: [
      '#FF1177', '#00FF66', '#00FFFF', '#FFE600',
      '#FF00FF', '#00FFC4', '#0066FF', '#FF8800'
    ],
    monochrome: [
      '#2B2B2B', '#404040', '#555555', '#6B6B6B',
      '#808080', '#959595', '#AAAAAA', '#BFBFBF'
    ]
  };

  // Draw slices
  let currentAngle = 0;
  const colors = colorSchemes[config.colorScheme || 'default'];

  sliceSizes.forEach((size, i) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, currentAngle, currentAngle + size);
    ctx.closePath();
    
    // Fill slice
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add number
    ctx.save();
    ctx.rotate(currentAngle + size / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText((i + 1).toString(), radius * 0.75, 0);
    ctx.restore();

    currentAngle += size;
  });

  // Draw center circle
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

export function spinWheel(elapsed: number, config: WheelConfig): number {
  const { spinSpeed, spinDuration, startRamp, endRamp } = config;
  
  // Calculate rotation based on time
  let progress = elapsed / spinDuration;
  if (progress > 1) progress = 1;

  // Apply easing for start and end ramps
  let speed = spinSpeed;
  if (elapsed < startRamp) {
    speed *= elapsed / startRamp;
  } else if (elapsed > spinDuration - endRamp) {
    const timeLeft = spinDuration - elapsed;
    speed *= timeLeft / endRamp;
  }

  return (progress * speed * Math.PI * 20) % (Math.PI * 2);
}
