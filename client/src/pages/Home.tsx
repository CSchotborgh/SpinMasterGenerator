import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WheelCanvas } from "../components/WheelCanvas";
import { SidePanel } from "../components/SidePanel";
import { FileControls } from "../components/FileControls";
import { useState } from "react";

export type ColorScheme = 'default' | 'pastel' | 'neon' | 'monochrome' | 'sunset' | 'ocean';

export interface WheelConfig {
  slices: number;
  circumference: number;
  randomSizes: boolean;
  spinSpeed: number;
  spinDuration: number;
  startRamp: number;
  endRamp: number;
  friction: number;
  velocityVariation: number;
  minVelocity: number;
  colorScheme: ColorScheme;
  customColors: (string | null)[];
  sliceLabels: string[];
  textRotations: number[];
  textVertical: boolean[];
  sliceSizes: number[];
  fontSize: number[];
  manualRotation: number;
  textFontStyle: ('proportional' | 'monospace')[];
  textKerning: number[];
  verticalKerning: number[];
}

export default function Home() {
  const [config, setConfig] = useState<WheelConfig>({
    slices: 8,
    circumference: 500,
    randomSizes: false,
    spinSpeed: 5,
    spinDuration: 5,
    startRamp: 1,
    endRamp: 1,
    friction: 3.5,
    velocityVariation: 0.2,
    minVelocity: 0.1,
    colorScheme: 'default',
    customColors: Array(8).fill(null),
    sliceLabels: Array(8).fill(''),
    manualRotation: 0,
    textRotations: Array(8).fill(0),
    textVertical: Array(8).fill(false),
    sliceSizes: Array(8).fill(2 * Math.PI / 8),
    fontSize: Array(8).fill(0), // 0 means auto-calculated based on wheel size
    textFontStyle: Array(8).fill('proportional'), // Default to proportional font
    textKerning: Array(8).fill(0), // Default kerning value
    verticalKerning: Array(8).fill(0), // Default vertical kerning value
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordingComplete = (gifBlob: Blob) => {
    try {
      setIsRecording(false);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const url = URL.createObjectURL(gifBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wheel-animation-${timestamp}.gif`;
      document.body.appendChild(a);

      // Use setTimeout to ensure the download triggers after the blob is ready
      setTimeout(() => {
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading GIF:', error);
      toast({
        title: "Download Error",
        description: "Failed to download the animation. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Game Wheel Generator
      </h1>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-8">
          <Card className="w-full max-w-3xl p-6 flex items-center justify-center flex-col gap-6">
            <WheelCanvas 
              config={config} 
              isSpinning={isSpinning}
              isRecording={isRecording}
              onSpinComplete={() => setIsSpinning(false)}
              onConfigChange={setConfig}
              onRecordingComplete={handleRecordingComplete}
            />
            <Button
              size="lg"
              className="w-[200px] mt-16"
              onClick={() => setIsSpinning(true)}
              disabled={isSpinning}
            >
              Spin Wheel
            </Button>
          </Card>

          <SidePanel
            config={config}
            onConfigChange={setConfig}
            onSpin={() => setIsSpinning(true)}
            isSpinning={isSpinning}
            isRecording={isRecording}
            onStartRecording={() => setIsRecording(true)}
            onStopRecording={() => setIsRecording(false)}
          />
        </div>
      </div>
    </div>
  );
}