import { useEffect, useRef, useState } from "react";
import type { WheelConfig } from "../pages/Home";
import { renderWheel, spinWheel, getSliceAtPoint } from "../lib/wheel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface WheelCanvasProps {
  config: WheelConfig;
  isSpinning: boolean;
  onSpinComplete: () => void;
  onConfigChange: (config: WheelConfig) => void;
}

export function WheelCanvas({ config, isSpinning, onSpinComplete, onConfigChange }: WheelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });

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

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isSpinning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const sliceIndex = getSliceAtPoint(x, y, config);
    if (sliceIndex !== null) {
      setSelectedSlice(sliceIndex);
      setColorPickerPosition({ x: e.clientX, y: e.clientY });
      setColorPickerOpen(true);
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedSlice === null) return;
    
    const newCustomColors = [...config.customColors];
    newCustomColors[selectedSlice] = color;
    onConfigChange({ ...config, customColors: newCustomColors });
  };

  const handleLabelChange = (label: string) => {
    if (selectedSlice === null) return;
    
    const newSliceLabels = [...config.sliceLabels];
    newSliceLabels[selectedSlice] = label;
    // Preserve current slice sizes when updating label
    onConfigChange({
      ...config,
      sliceLabels: newSliceLabels,
      sliceSizes: [...config.sliceSizes]
    });
  };

  const handleTextRotation = (degree: number) => {
    if (selectedSlice === null) return;
    
    const newTextRotations = [...config.textRotations];
    newTextRotations[selectedSlice] = degree;
    onConfigChange({ ...config, textRotations: newTextRotations });
  };

  const handleVerticalTextToggle = (checked: boolean) => {
    if (selectedSlice === null) return;
    
    const newTextVertical = [...config.textVertical];
    newTextVertical[selectedSlice] = checked;
    onConfigChange({ ...config, textVertical: newTextVertical });
  };

  return (
    <div className="flex justify-center items-center relative">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto shadow-lg rounded-full"
        onContextMenu={handleContextMenu}
      />
      <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
        <PopoverTrigger asChild>
          <div 
            style={{ 
              position: 'fixed', 
              left: colorPickerPosition.x, 
              top: colorPickerPosition.y,
              visibility: 'hidden' 
            }} 
          />
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Choose Color for Slice {selectedSlice !== null ? selectedSlice + 1 : ''}</Label>
              <Input
                type="color"
                value={selectedSlice !== null ? (config.customColors[selectedSlice] || '#000000') : '#000000'}
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Slice Label</Label>
              <Input
                type="text"
                value={selectedSlice !== null ? config.sliceLabels[selectedSlice] : ''}
                onChange={(e) => handleLabelChange(e.target.value)}
                placeholder="Enter slice label"
              />
            </div>
            <div className="space-y-4">
              <Label>Text Rotation</Label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 90, 180, 270].map((degree) => (
                  <Button
                    key={degree}
                    variant={selectedSlice !== null && config.textRotations[selectedSlice] === degree ? "default" : "outline"}
                    onClick={() => handleTextRotation(degree)}
                    className="p-2"
                  >
                    {degree}°
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Custom Rotation</Label>
                  <span className="text-sm text-muted-foreground">
                    {selectedSlice !== null ? `${config.textRotations[selectedSlice]}°` : '0°'}
                  </span>
                </div>
                <Slider
                  value={[selectedSlice !== null ? config.textRotations[selectedSlice] : 0]}
                  onValueChange={([value]) => handleTextRotation(value)}
                  min={0}
                  max={360}
                  step={1}
                  className="py-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedSlice !== null ? config.textVertical[selectedSlice] : false}
                    onCheckedChange={handleVerticalTextToggle}
                  />
                  <Label>Vertical Text</Label>
                </div>
                {selectedSlice !== null && config.textVertical[selectedSlice] && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedSlice !== null ? config.textFontStyle[selectedSlice] === 'monospace' : false}
                      onCheckedChange={(checked) => {
                        if (selectedSlice === null) return;
                        const newTextFontStyle = [...config.textFontStyle];
                        newTextFontStyle[selectedSlice] = checked ? 'monospace' : 'proportional';
                        onConfigChange({ ...config, textFontStyle: newTextFontStyle });
                      }}
                    />
                    <Label>Non-proportional Font</Label>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Text Padding</Label>
                  <span className="text-sm text-muted-foreground">
                    {selectedSlice !== null ? `${config.textPadding[selectedSlice]}%` : '10%'}
                  </span>
                </div>
                <Slider
                  value={[selectedSlice !== null ? config.textPadding[selectedSlice] : 10]}
                  onValueChange={([value]) => {
                    if (selectedSlice === null) return;
                    const newTextPadding = [...config.textPadding];
                    newTextPadding[selectedSlice] = value;
                    onConfigChange({ ...config, textPadding: newTextPadding });
                  }}
                  min={0}
                  max={50}
                  step={1}
                  className="py-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Font Size</Label>
                  <span className="text-sm text-muted-foreground">
                    {selectedSlice !== null && config.fontSize[selectedSlice] ? 
                      `${config.fontSize[selectedSlice]}px` : 'Auto'}
                  </span>
                </div>
                <Slider
                  value={[selectedSlice !== null ? config.fontSize[selectedSlice] || 12 : 12]}
                  onValueChange={([value]) => {
                    if (selectedSlice === null) return;
                    const newFontSize = [...config.fontSize];
                    newFontSize[selectedSlice] = value;
                    onConfigChange({ ...config, fontSize: newFontSize });
                  }}
                  min={12}
                  max={48}
                  step={1}
                  className="py-2"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
