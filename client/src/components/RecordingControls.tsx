import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface RecordingControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled: boolean;
}

export function RecordingControls({
  isRecording,
  onStartRecording,
  onStopRecording,
  disabled
}: RecordingControlsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Recording Controls</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Animation Recording</Label>
          <div className="flex items-center gap-4">
            {!isRecording ? (
              <Button
                variant="outline"
                onClick={onStartRecording}
                disabled={disabled}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Start Recording
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onStopRecording}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Stop Recording
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
