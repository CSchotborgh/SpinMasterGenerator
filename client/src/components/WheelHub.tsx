
import { ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WheelConfig } from "../pages/Home";

interface WheelHubProps {
  config: WheelConfig;
  onConfigChange: (config: WheelConfig) => void;
}

export function WheelHub({ config, onConfigChange }: WheelHubProps) {
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onConfigChange({
          ...config,
          hubImage: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (size: number) => {
    onConfigChange({
      ...config,
      hubSize: size
    });
  };

  return (
    <div 
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
      style={{ 
        width: config.hubSize,
        height: config.hubSize
      }}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-lg border-4 border-gray-800">
        {config.hubImage ? (
          <img 
            src={config.hubImage} 
            alt="Wheel Hub"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">Hub Image</span>
          </div>
        )}
      </div>
    </div>
  );
}
