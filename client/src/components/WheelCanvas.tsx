import { useEffect, useRef } from "react";
import type { WheelConfig } from "../pages/Home";
import { renderWheel, spinWheel } from "../lib/wheel";

interface WheelCanvasProps {
  config: WheelConfig;
  isSpinning: boolean;
  onSpinComplete: () => void;
}

export function WheelCanvas({ config, isSpinning, onSpinComplete }: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = config.circumference;
    canvas.height = config.circumference;

    // Initial render
    renderWheel(ctx, config);

    // Handle spinning animation
    if (isSpinning) {
      let startTime = performance.now();
      let rotation = 0;

      const animate = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;
        
        if (elapsed >= config.spinDuration) {
          onSpinComplete();
          renderWheel(ctx, config, rotation);
          return;
        }

        rotation = spinWheel(elapsed, config);
        renderWheel(ctx, config, rotation);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, isSpinning, onSpinComplete]);

  return (
    <div className="flex justify-center items-center">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto shadow-lg rounded-full"
      />
    </div>
  );
}
