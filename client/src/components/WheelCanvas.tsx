import { useEffect, useRef, useState } from "react";
import GIF from 'gif.js';
import type { WheelConfig } from "../pages/Home";
import { renderWheel, spinWheel, getSliceAtPoint } from "../lib/wheel";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
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
  isRecording: boolean;
  onSpinComplete: () => void;
  onConfigChange: (config: WheelConfig) => void;
  onRecordingComplete: (gifBlob: Blob) => void;
}

export function WheelCanvas({ 
  config, 
  isSpinning, 
  isRecording,
  onSpinComplete, 
  onConfigChange,
  onRecordingComplete 
}: WheelCanvasProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gifRef = useRef<GIF>();
  const [recordingProgress, setRecordingProgress] = useState(0);
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

    // Handle spinning animation and recording
    if (isSpinning) {
      let startTime = performance.now();
      let rotation = 0;
      let frames: ImageData[] = [];
      const frameRate = 30; // frames per second
      const frameInterval = 1000 / frameRate;
      let lastFrameTime = 0;

      // Initialize GIF.js if recording
      if (isRecording) {
        toast({
          title: "Recording Started",
          description: "Recording wheel animation...",
          duration: 3000,
        });

        gifRef.current = new GIF({
          workers: 2,
          quality: 10,
          width: canvas.width,
          height: canvas.height,
          workerScript: '/gif.worker.js'
        });

        gifRef.current.on('progress', (p) => {
          setRecordingProgress(Math.round(p * 100));
        });

        gifRef.current.on('finished', (blob: Blob) => {
          toast({
            title: "Recording Complete",
            description: "Your animation has been saved to downloads",
            duration: 5000,
          });
          onRecordingComplete(blob);
          gifRef.current?.abort(); // Clean up
        });

        gifRef.current.on('error', (err) => {
          toast({
            title: "Recording Error",
            description: "Failed to generate animation. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
          console.error('GIF generation error:', err);
        });
      }

      const animate = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;
        
        if (elapsed >= config.spinDuration) {
          if (isRecording && gifRef.current && frames.length > 0) {
            toast({
              title: "Processing Recording",
              description: "Generating GIF animation...",
              duration: 3000,
            });

            try {
              // Add all captured frames to GIF
              frames.forEach(frame => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                const tempCtx = tempCanvas.getContext('2d');
                if (tempCtx) {
                  tempCtx.putImageData(frame, 0, 0);
                  gifRef.current?.addFrame(tempCanvas, { delay: frameInterval });
                }
              });

              // Render the GIF
              gifRef.current.render();
            } catch (error) {
              toast({
                title: "Recording Error",
                description: "Failed to process animation frames. Please try again.",
                variant: "destructive",
                duration: 5000,
              });
              console.error('Error processing frames:', error);
            }
          }
          onSpinComplete();
          renderWheel(ctx, config, rotation);
          return;
        }

        rotation = spinWheel(elapsed, config);
        renderWheel(ctx, config, rotation);

        // Capture frame for recording
        if (isRecording && currentTime - lastFrameTime >= frameInterval) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          frames.push(imageData);
          lastFrameTime = currentTime;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (gifRef.current) {
        gifRef.current.abort();
      }
    };
  }, [config, isSpinning, isRecording, onSpinComplete, onRecordingComplete, toast]);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        // Keep dialog within viewport bounds
        const dialog = document.querySelector('[role="dialog"]');
        if (dialog) {
          const bounds = dialog.getBoundingClientRect();
          const maxX = window.innerWidth - bounds.width;
          const maxY = window.innerHeight - bounds.height;
          
          setDialogPosition({
            x: Math.min(Math.max(x, 0), maxX),
            y: Math.min(Math.max(y, 0), maxY)
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

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
      {isRecording && recordingProgress > 0 && (
        <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-md">
          Recording: {recordingProgress}%
        </div>
      )}
      <Dialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      >
        <DialogContent 
          className="absolute overflow-y-auto p-6 bg-white rounded-lg"
          style={{ 
            width: '320px',
            maxHeight: '80vh',
            top: dialogPosition.y,
            left: dialogPosition.x,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            zIndex: 50
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.dialog-header')) {
              setIsDragging(true);
              const bounds = e.currentTarget.getBoundingClientRect();
              setDragOffset({
                x: e.clientX - bounds.left,
                y: e.clientY - bounds.top
              });
            }
          }}
        >
          <DialogTitle className="text-lg font-semibold dialog-header cursor-grab active:cursor-grabbing">
            Slice {selectedSlice !== null ? selectedSlice + 1 : ''} Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mb-4">
            Customize the appearance and text of this wheel slice.
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </DialogClose>
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
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}