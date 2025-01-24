import { useEffect, useRef, useState } from "react";
import GIF from 'gif.js';
import type { WheelConfig } from "../pages/Home";
import { renderWheel, spinWheel, getSliceAtPoint } from "../lib/wheel";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import type { SpinHistoryEntry } from "../types/SpinHistory";

// Helper function to generate UUID using Web Crypto API
function generateUUID(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}

// Helper function to get Fibonacci number at position n
function getFibonacci(n: number): number {
  if (n <= 1) return 1;
  let prev = 1, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

interface WheelCanvasProps {
  config: WheelConfig;
  isSpinning: boolean;
  isRecording: boolean;
  onSpinComplete: (result: SpinHistoryEntry) => void;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const gifRef = useRef<GIF>();
  const framesRef = useRef<ImageData[]>([]);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [spinAngle, setSpinAngle] = useState(config.manualRotation);
  const lastSpinAngleRef = useRef(config.manualRotation);
  const spinCountRef = useRef(0);
  const sliceIdsRef = useRef<string[]>([]);

  // Initialize slice IDs if not already set
  useEffect(() => {
    if (sliceIdsRef.current.length !== config.slices) {
      sliceIdsRef.current = Array(config.slices).fill(null).map(() => generateUUID());
    }
  }, [config.slices]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate size of a single slice in radians
    const sliceSize = (2 * Math.PI) / config.slices;
    // Initial offset to center the wheel (half a slice)
    const initialOffset = -sliceSize / 2;

    canvas.width = config.circumference;
    canvas.height = config.circumference;

    // Render with the initial offset
    renderWheel(ctx, config, initialOffset);

    const frameRate = 60;
    const frameInterval = 1000 / frameRate;
    let lastFrameTime = 0;

    if (isSpinning) {
      let startTime = performance.now();
      framesRef.current = [];

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
          workerScript: '/gif.worker.js',
          debug: true,
          dither: false
        });

        gifRef.current.on('progress', (percent: number) => {
          setRecordingProgress(Math.round(percent * 100));
        });

        gifRef.current.on('finished', (blob: Blob) => {
          setIsProcessing(false);
          setRecordingProgress(0);
          framesRef.current = [];

          onRecordingComplete(blob);

          if (gifRef.current) {
            gifRef.current.abort();
            gifRef.current = undefined;
          }
        });
      }

      const animate = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;

        if (elapsed >= config.spinDuration) {
          spinCountRef.current += 1;
          let baseRotation = spinWheel(config.spinDuration, config);

          // Get target slice from Fibonacci sequence
          const fibNumber = getFibonacci(spinCountRef.current);
          const targetSlice = (fibNumber - 1) % config.slices;

          // Calculate target angle including initial offset
          const targetAngle = (sliceSize * targetSlice) + initialOffset;

          // Adjust current rotation to include initial offset
          const currentRotation = (baseRotation + lastSpinAngleRef.current) % (2 * Math.PI);
          const adjustment = targetAngle - currentRotation;

          // Apply the adjustment to ensure we land centered on the target slice
          baseRotation += adjustment;

          const finalRotation = lastSpinAngleRef.current + baseRotation;
          lastSpinAngleRef.current = finalRotation;
          setSpinAngle(finalRotation);

          onConfigChange({
            ...config,
            manualRotation: finalRotation
          });

          // Calculate the landed slice index accounting for the offset
          const normalizedRotation = ((finalRotation - initialOffset) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
          const landedSliceIndex = Math.floor(normalizedRotation / sliceSize);

          console.log('Landed slice calculation:', {
            finalRotation,
            normalizedRotation,
            sliceSize,
            landedSliceIndex,
            sliceLabel: config.sliceLabels[landedSliceIndex]
          });

          const historyEntry: SpinHistoryEntry = {
            id: generateUUID(),
            timestamp: new Date(),
            selectedSlice: landedSliceIndex,
            sliceId: sliceIdsRef.current[landedSliceIndex],
            sliceLabel: config.sliceLabels[landedSliceIndex] || `Slice ${landedSliceIndex + 1}`,
            rotation: finalRotation,
            settings: {
              rotation: finalRotation,
              velocity: config.spinSpeed,
              duration: config.spinDuration
            }
          };

          onSpinComplete(historyEntry);
          toast({
            title: "Spin Complete!",
            description: `Landed on: ${historyEntry.sliceLabel}`,
            duration: 3000,
          });
          return;
        }

        if (containerRef.current) {
          // Include initial offset in the rotation calculation
          const currentRotation = lastSpinAngleRef.current + spinWheel(elapsed, config) + initialOffset;
          containerRef.current.style.transform = `rotate(${currentRotation}rad)`;
          setSpinAngle(currentRotation);
          lastSpinAngleRef.current = currentRotation - initialOffset;
        }

        if (isRecording && currentTime - lastFrameTime >= frameInterval) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          framesRef.current.push(imageData);
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

      if (isRecording && framesRef.current.length > 0 && !isProcessing) {
        setIsProcessing(true);

        toast({
          title: "Processing Recording",
          description: "Generating GIF animation...",
          duration: 3000,
        });

        try {
          if (gifRef.current) {
            gifRef.current.abort();
          }

          gifRef.current = new GIF({
            workers: 2,
            quality: 10,
            width: canvas.width,
            height: canvas.height,
            workerScript: '/gif.worker.js',
            debug: true,
            dither: false
          });

          gifRef.current.on('progress', (percent: number) => {
            setRecordingProgress(Math.round(percent * 100));
          });

          gifRef.current.on('finished', (blob: Blob) => {
            setIsProcessing(false);
            setRecordingProgress(0);
            framesRef.current = [];

            onRecordingComplete(blob);

            if (gifRef.current) {
              gifRef.current.abort();
              gifRef.current = undefined;
            }
          });

          console.log(`Processing ${framesRef.current.length} frames...`);

          const offscreenCanvas = document.createElement('canvas');
          offscreenCanvas.width = canvas.width;
          offscreenCanvas.height = canvas.height;
          const offscreenCtx = offscreenCanvas.getContext('2d');

          if (!offscreenCtx) {
            throw new Error('Failed to get offscreen canvas context');
          }

          for (let i = 0; i < framesRef.current.length; i++) {
            const frame = framesRef.current[i];
            offscreenCtx.putImageData(frame, 0, 0);

            gifRef.current?.addFrame(offscreenCanvas, {
              delay: frameInterval,
              copy: true
            });

            if (i % 10 === 0) {
              console.log(`Processed ${i + 1}/${framesRef.current.length} frames`);
            }
          }

          console.log('Starting GIF render...');
          gifRef.current?.render();

        } catch (error) {
          console.error('Detailed error in frame processing:', error);
          setIsProcessing(false);
          setRecordingProgress(0);
          framesRef.current = [];

          toast({
            title: "Recording Error",
            description: `Failed to process animation frames: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
            duration: 5000,
          });

          if (gifRef.current) {
            gifRef.current.abort();
            gifRef.current = undefined;
          }
        }
      } else if (gifRef.current) {
        gifRef.current.abort();
      }
    };
  }, [config, isSpinning, isRecording, onSpinComplete, onRecordingComplete, toast, onConfigChange]);

  useEffect(() => {
    if (!isSpinning) {
      lastSpinAngleRef.current = config.manualRotation;
      setSpinAngle(config.manualRotation);
    }
  }, [config.manualRotation, isSpinning]);

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isSpinning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    const angle = -config.manualRotation;
    const rotatedX = x * Math.cos(angle) - y * Math.sin(angle) + centerX;
    const rotatedY = x * Math.sin(angle) + y * Math.cos(angle) + centerY;

    const sliceIndex = getSliceAtPoint(rotatedX, rotatedY, config);
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
    <div className="flex justify-center items-center relative wheel-container">
      <div
        ref={containerRef}
        className="relative transition-transform duration-100 hover:scale-102"
        style={{ transform: `rotate(${spinAngle}rad)` }}
      >
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto shadow-lg rounded-full"
          onContextMenu={handleContextMenu}
        />
        <div
          className="absolute top-1/2 left-1/2 rounded-full overflow-hidden z-10 shadow-lg bg-gradient-to-br from-slate-700 to-slate-900 hub-container"
          style={{
            width: `${config.hubSize}px`,
            height: `${config.hubSize}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {config.hubImage ? (
            <img
              src={config.hubImage}
              alt="Wheel Hub"
              className="w-full h-full object-cover"
              style={{
                transform: config.hubSpinsWithWheel ? `rotate(${spinAngle}rad)` : 'none',
              }}
            />
          ) : (
            <div className="w-full h-full bg-primary/10" />
          )}
        </div>
      </div>
      <div
        className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 z-10 wheel-pointer"
        style={{
          borderLeft: '60px solid transparent',
          borderRight: '60px solid transparent',
          borderBottom: '120px solid rgba(255,255,255,0.95)',
          borderRadius: `${config.arrowRadius || 0}px`,
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.6))',
        }}
      />
      {isRecording && recordingProgress > 0 && (
        <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-md">
          Recording: {recordingProgress}%
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="absolute overflow-y-auto p-6 bg-white rounded-lg shadow-lg"
          style={{
            width: '320px',
            maxHeight: '80vh',
            top: dialogPosition.y,
            left: dialogPosition.x,
            transform: 'translate(-50%, -50%)',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            zIndex: 50
          }}
          aria-describedby="slice-settings-desc"
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
          <DialogHeader className="dialog-header cursor-grab active:cursor-grabbing">
            <DialogTitle id="slice-settings-title">
              Slice {selectedSlice !== null ? selectedSlice + 1 : ''} Settings
            </DialogTitle>
            <DialogDescription id="slice-settings-desc">
              Customize the appearance and text of this wheel slice. You can adjust colors, labels, and text orientation.
            </DialogDescription>
          </DialogHeader>
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