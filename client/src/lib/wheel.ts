import type { WheelConfig } from "../pages/Home";

export function renderWheel(
  ctx: CanvasRenderingContext2D,
  config: WheelConfig,
  rotation: number = 0
) {
  const { circumference, slices, randomSizes } = config;
  const radius = (circumference - 20) / 2;
  
  // Clear canvas and set center point
  ctx.clearRect(0, 0, circumference, circumference);
  ctx.save();
  ctx.translate(circumference / 2, circumference / 2);
  ctx.rotate(rotation);

  // Use stored slice sizes or calculate new ones if needed
  let sliceSizes = [...config.sliceSizes];
  
  // Recalculate sizes only if the number of slices changed or sizes array is empty
  if (sliceSizes.length !== slices) {
    sliceSizes = Array(slices).fill(2 * Math.PI / slices);
    if (randomSizes) {
      const total = 2 * Math.PI;
      sliceSizes.forEach((_, i) => {
        if (i < sliceSizes.length - 1) {
          sliceSizes[i] *= 0.5 + Math.random();
        }
      });
      // Adjust last slice to make total 2π
      const currentTotal = sliceSizes.slice(0, -1).reduce((sum, size) => sum + size);
      sliceSizes[sliceSizes.length - 1] = total - currentTotal;
    }
    // Update the config with new slice sizes
    config.sliceSizes = sliceSizes;
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
  const schemeColors = colorSchemes[config.colorScheme || 'default'];

  sliceSizes.forEach((size, i) => {
    const customColor = config.customColors[i];
    const color = customColor || schemeColors[i % schemeColors.length];
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, currentAngle, currentAngle + size);
    ctx.closePath();
    
    // Fill slice
    ctx.fillStyle = color;
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw slice label
    const label = config.sliceLabels[i] || '';
    if (label) {
      // Save context for text rotation
      ctx.save();
      
      // Move to center of slice
      const labelRadius = radius * 0.75;
      const labelAngle = currentAngle + (size / 2);
      const x = labelRadius * Math.cos(labelAngle);
      const y = labelRadius * Math.sin(labelAngle);
      
      // Rotate and position text
      ctx.translate(x, y);
      // Apply text rotation (convert degrees to radians) and add base rotation
      const textRotation = (config.textRotations[i] * Math.PI / 180) + labelAngle + Math.PI / 2;
      ctx.rotate(textRotation);
      
      // Calculate available space and font size
      const maxSliceHeight = radius * 0.5; // Maximum height available in slice
      const padding = maxSliceHeight * 0.1; // 10% padding
      const availableHeight = maxSliceHeight - (padding * 2);
      const baseFontSize = Math.max(12, config.circumference / 30);
      
      // Set text properties
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (config.textVertical[i]) {
        // Calculate arc length and available space for this slice
        const arcLength = size * radius;
        const sliceHeight = arcLength * 0.8; // Use 80% of arc length as max height
        const availableSliceHeight = sliceHeight;
        
        // Calculate width at different distances from center
        const innerRadius = radius * 0.3; // Start text from 30% of radius
        const outerRadius = radius * 0.9; // End text at 90% of radius
        const avgWidth = size * ((innerRadius + outerRadius) / 2); // Average width for initial calculations
        
        // Calculate proportional font size based on both arc length and width
        const chars = label.split('');
        const sliceProportion = size / (2 * Math.PI);
        const proportionalBase = baseFontSize * Math.sqrt(sliceProportion);
        const widthFactor = avgWidth / (2 * Math.PI * radius / config.slices);
        const fontSize = config.fontSize[i] || Math.min(
          proportionalBase * Math.sqrt(widthFactor),
          availableSliceHeight / (chars.length * 1.1) // Reduce spacing factor to 1.1
        );
        
        const fontFamily = config.textFontStyle[i] === 'monospace' ? 'Courier New' : 'Arial';
        ctx.font = `${fontSize}px ${fontFamily}`;
        const verticalKerning = config.verticalKerning[i];
        const lineHeight = fontSize * (1.1 + verticalKerning * 0.2); // Adjust line height based on vertical kerning
        
        // Calculate maximum chars that can fit in this slice
        const maxChars = Math.floor(availableSliceHeight / lineHeight);
        const displayChars = chars.slice(0, maxChars);
        if (chars.length > maxChars) {
          displayChars[maxChars - 1] = '…';
        }
        
        const totalHeight = displayChars.length * lineHeight;
        const startY = -totalHeight / 2;
        
        // Distribute characters along the slice's arc
        displayChars.forEach((char, index) => {
          // Calculate position along the arc
          const progress = index / (displayChars.length - 1);
          const currentRadius = innerRadius + (outerRadius - innerRadius) * progress;
          const yOffset = startY + (index * lineHeight) + (fontSize / 2);
          
          // Calculate arc-adjusted position
          const angleOffset = (yOffset / currentRadius) * sliceProportion;
          const x = Math.sin(angleOffset) * currentRadius * 0.1; // Slight x-offset for arc effect
          const y = yOffset * (currentRadius / radius); // Scale y-offset based on current radius
          
          // Draw character with arc adjustment
          ctx.save();
          ctx.translate(x, y);
          // Slight rotation adjustment based on position in arc
          const charRotation = Math.atan2(x, currentRadius) * 0.5;
          ctx.rotate(charRotation);
          // Apply kerning to character positioning
          const kerning = config.textKerning[i];
          ctx.fillText(char, kerning * fontSize / 2, 0);
          ctx.restore();
        });
      } else {
        // Set horizontal text font size
        ctx.font = `${baseFontSize}px Arial`;
        
        // Truncate horizontal text if too wide
        const maxWidth = labelRadius * 0.8;
        let displayText = label;
        const kerningValue = config.textKerning[i];
        const letterSpacingValue = kerningValue * baseFontSize / 4;
        ctx.letterSpacing = `${letterSpacingValue}px`;
        let textWidth = ctx.measureText(displayText).width;
        
        while (textWidth > maxWidth && displayText.length > 1) {
          displayText = displayText.slice(0, -1) + '…';
          textWidth = ctx.measureText(displayText).width;
        }
        
        ctx.fillText(displayText, 0, 0);
      }
      
      // Restore context
      ctx.restore();
    }

    currentAngle += size;
  });

  // Draw center circle
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

export function getSliceAtPoint(
  x: number,
  y: number,
  config: WheelConfig
): number | null {
  const { circumference, slices } = config;
  const center = circumference / 2;
  const radius = center - 10;

  // Convert click coordinates to be relative to wheel center
  const relativeX = x - center;
  const relativeY = y - center;

  // Calculate distance from center
  const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
  if (distance > radius || distance < 15) return null;

  // Calculate angle
  let angle = Math.atan2(relativeY, relativeX);
  if (angle < 0) angle += 2 * Math.PI;

  // Convert angle to slice index
  const sliceSize = (2 * Math.PI) / slices;
  const sliceIndex = Math.floor(angle / sliceSize);
  
  return sliceIndex;
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
