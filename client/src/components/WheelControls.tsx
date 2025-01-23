import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added import for Input component
import type { WheelConfig, ColorScheme } from "../pages/Home";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WheelControlsProps {
  config: WheelConfig;
  onConfigChange: (config: WheelConfig) => void;
  onSpin: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

export function WheelControls({ config, onConfigChange, onSpin, disabled, isSpinning }: WheelControlsProps) {
  const updateConfig = (key: keyof WheelConfig, value: number | boolean | string | null) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Wheel Controls</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Number of Slices ({config.slices})</Label>
          <Slider
            value={[config.slices]}
            onValueChange={([v]) => updateConfig("slices", v)}
            min={2}
            max={24}
            step={1}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Wheel Size ({config.circumference}px)</Label>
          <Slider
            value={[config.circumference]}
            onValueChange={([v]) => updateConfig("circumference", v)}
            min={200}
            max={800}
            step={10}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={config.randomSizes}
            onCheckedChange={(v) => updateConfig("randomSizes", v)}
            disabled={disabled}
          />
          <Label>Random Slice Sizes</Label>
        </div>

        <div className="space-y-2">
          <Label>Spin Speed ({config.spinSpeed}x)</Label>
          <Slider
            value={[config.spinSpeed]}
            onValueChange={([v]) => updateConfig("spinSpeed", v)}
            min={1}
            max={10}
            step={0.5}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Spin Duration ({config.spinDuration}s)</Label>
          <Slider
            value={[config.spinDuration]}
            onValueChange={([v]) => updateConfig("spinDuration", v)}
            min={1}
            max={10}
            step={0.5}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Start Ramp ({config.startRamp}s)</Label>
          <Slider
            value={[config.startRamp]}
            onValueChange={([v]) => updateConfig("startRamp", v)}
            min={0.1}
            max={2}
            step={0.1}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>End Ramp ({config.endRamp}s)</Label>
          <Slider
            value={[config.endRamp]}
            onValueChange={([v]) => updateConfig("endRamp", v)}
            min={0.1}
            max={2}
            step={0.1}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <Select
            value={config.colorScheme}
            onValueChange={(value: ColorScheme) => updateConfig("colorScheme", value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a color scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="pastel">Pastel</SelectItem>
              <SelectItem value="neon">Neon</SelectItem>
              <SelectItem value="monochrome">Monochrome</SelectItem>
              <SelectItem value="sunset">Sunset</SelectItem>
              <SelectItem value="ocean">Ocean</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Friction ({config.friction})</Label>
          <Slider
            value={[config.friction]}
            onValueChange={([v]) => updateConfig("friction", v)}
            min={0.5}
            max={8}
            step={0.1}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Initial Velocity Variation ({config.velocityVariation})</Label>
          <Slider
            value={[config.velocityVariation]}
            onValueChange={([v]) => updateConfig("velocityVariation", v)}
            min={0}
            max={0.5}
            step={0.01}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Minimum Velocity ({config.minVelocity})</Label>
          <Slider
            value={[config.minVelocity]}
            onValueChange={([v]) => updateConfig("minVelocity", v)}
            min={0.01}
            max={1}
            step={0.01}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Manual Rotation ({Math.round(config.manualRotation * (180 / Math.PI))}°)</Label>
          <Slider
            value={[config.manualRotation]}
            onValueChange={([v]) => updateConfig("manualRotation", v)}
            min={0}
            max={Math.PI * 2}
            step={0.01}
            disabled={disabled || isSpinning}
          />
        </div>
        <div className="space-y-2">
            <Label>Arrow Marker Radius</Label>
            <Slider
              value={[config.arrowRadius || 0]}
              onValueChange={([value]) => updateConfig("arrowRadius", value)}
              max={60}
              step={1}
              className="py-2"
            />
          </div>
        <div className="space-y-2">
          <Label>Hub Size ({config.hubSize}px)</Label>
          <Slider
            value={[config.hubSize]}
            onValueChange={([v]) => updateConfig("hubSize", v)}
            min={20}
            max={200}
            step={5}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={config.hubSpinsWithWheel}
            onCheckedChange={(v) => updateConfig("hubSpinsWithWheel", v)}
            disabled={disabled}
          />
          <Label>Hub Spins with Wheel</Label>
        </div>

        <div className="mt-2">
          <Label>Hub Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateConfig("hubImage", reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="mt-1"
            disabled={disabled}
          />
          {config.hubImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateConfig("hubImage", null)}
              className="mt-2"
              disabled={disabled}
            >
              Remove Image
            </Button>
          )}
        </div>

        <Button
          className="w-full mt-4"
          size="lg"
          onClick={onSpin}
          disabled={disabled}
        >
          Spin Wheel
        </Button>
      </div>
    </div>
  );
}