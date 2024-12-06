import { useEffect, useRef, useState } from "react";
import type { WheelConfig } from "../pages/Home";
import { renderWheel, spinWheel, getSliceAtPoint } from "../lib/wheel";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
      setDialogPosition({ x: e.clientX, y: e.clientY });
      setDialogOpen(true);
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className="absolute w-80 p-6 cursor-move select-none"
          style={{ 
            left: `${dialogPosition.x}px`, 
            top: `${dialogPosition.y}px`,
            transform: 'none'
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIsDragging(true);
              const rect = e.currentTarget.getBoundingClientRect();
              setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              });
            }
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              setDialogPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
              });
            }
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </DialogClose>
          <DialogTitle className="text-lg font-semibold">
            Slice {selectedSlice !== null ? selectedSlice + 1 : ''} Settings
          </DialogTitle>
          <div className="space-y-4 pt-2">
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Letter Spacing</Label>
                  <span className="text-sm text-muted-foreground">
                    {selectedSlice !== null ? `${config.textKerning[selectedSlice]}` : '0'}
                  </span>
                </div>
                <Slider
                  value={[selectedSlice !== null ? config.textKerning[selectedSlice] : 0]}
                  onValueChange={([value]) => {
                    if (selectedSlice === null) return;
                    const newTextKerning = [...config.textKerning];
                    newTextKerning[selectedSlice] = value;
                    onConfigChange({ ...config, textKerning: newTextKerning });
                  }}
                  min={-2}
                  max={5}
                  step={0.1}
                  className="py-2"
                />
              </div>
              {selectedSlice !== null && config.textVertical[selectedSlice] && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Vertical Spacing</Label>
                    <span className="text-sm text-muted-foreground">
                      {selectedSlice !== null ? `${config.verticalKerning[selectedSlice]}` : '0'}
                    </span>
                  </div>
                  <Slider
                    value={[selectedSlice !== null ? config.verticalKerning[selectedSlice] : 0]}
                    onValueChange={([value]) => {
                      if (selectedSlice === null) return;
                      const newVerticalKerning = [...config.verticalKerning];
                      newVerticalKerning[selectedSlice] = value;
                      onConfigChange({ ...config, verticalKerning: newVerticalKerning });
                    }}
                    min={-2}
                    max={5}
                    step={0.1}
                    className="py-2"
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
