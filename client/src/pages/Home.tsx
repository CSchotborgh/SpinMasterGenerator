import { Card } from "@/components/ui/card";
import { WheelCanvas } from "../components/WheelCanvas";
import { WheelControls } from "../components/WheelControls";
import { FileControls } from "../components/FileControls";
import { useState } from "react";

export type ColorScheme = 'default' | 'pastel' | 'neon' | 'monochrome';

export interface WheelConfig {
  slices: number;
  circumference: number;
  randomSizes: boolean;
  spinSpeed: number;
  spinDuration: number;
  startRamp: number;
  endRamp: number;
  colorScheme: ColorScheme;
  customColors: (string | null)[];
  sliceLabels: string[];
  textRotations: number[];
  textVertical: boolean[];
  sliceSizes: number[];
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
    colorScheme: 'default',
    customColors: Array(8).fill(null),
    sliceLabels: Array(8).fill(''),
    textRotations: Array(8).fill(0),
    textVertical: Array(8).fill(false),
    sliceSizes: Array(8).fill(2 * Math.PI / 8),
  });

  const [isSpinning, setIsSpinning] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Game Wheel Generator
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <WheelCanvas 
            config={config} 
            isSpinning={isSpinning}
            onSpinComplete={() => setIsSpinning(false)}
            onConfigChange={setConfig}
          />
        </Card>
        
        <div className="space-y-6">
          <Card className="p-6">
            <WheelControls
              config={config}
              onConfigChange={setConfig}
              onSpin={() => setIsSpinning(true)}
              disabled={isSpinning}
            />
          </Card>
          
          <Card className="p-6">
            <FileControls
              config={config}
              onConfigChange={setConfig}
              disabled={isSpinning}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
