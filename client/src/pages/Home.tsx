import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WheelCanvas } from "../components/WheelCanvas";
import { SidePanel } from "../components/SidePanel";
import { FileControls } from "../components/FileControls";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { SpinHistory as SpinHistoryType, SpinHistoryEntry } from "../types/SpinHistory";

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
  // Hub-related properties
  hubSize: number;
  hubImage: string | null;
  hubSpinsWithWheel: boolean;
  // Arrow marker properties
  arrowRadius: number;
}

export default function Home() {
  const { toast } = useToast();
  const [spinHistory, setSpinHistory] = useState<SpinHistoryType>([]);

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
    fontSize: Array(8).fill(0),
    textFontStyle: Array(8).fill('proportional'),
    textKerning: Array(8).fill(0),
    verticalKerning: Array(8).fill(0),
    hubSize: 50,
    hubImage: null,
    hubSpinsWithWheel: true,
    arrowRadius: 0,
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

  const handleSpinComplete = (result: SpinHistoryEntry) => {
    setIsSpinning(false);
    setSpinHistory(prev => [result, ...prev]);

    toast({
      title: "Spin Complete!",
      description: `Landed on: ${result.sliceLabel}`,
      duration: 3000,
    });
  };

  const handleClearHistory = () => {
    setSpinHistory([]);
    toast({
      title: "History Cleared",
      description: "Spin history has been cleared.",
      duration: 3000,
    });
  };

  const handleExportHistory = () => {
    try {
      const historyData = JSON.stringify(spinHistory, null, 2);
      const blob = new Blob([historyData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wheel-history-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "History Exported",
        description: "Spin history has been exported successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error exporting history:', error);
      toast({
        title: "Export Error",
        description: "Failed to export spin history. Please try again.",
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
              onSpinComplete={handleSpinComplete}
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
            spinHistory={spinHistory}
            onClearHistory={handleClearHistory}
            onExportHistory={handleExportHistory}
          />
        </div>
      </div>
    </div>
  );
}