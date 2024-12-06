import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { exportConfig, importConfig } from "../lib/files";
import type { WheelConfig } from "../pages/Home";

interface FileControlsProps {
  config: WheelConfig;
  onConfigChange: (config: WheelConfig) => void;
  disabled: boolean;
}

export function FileControls({ config, onConfigChange, disabled }: FileControlsProps) {
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedConfig = await importConfig(file);
      onConfigChange(importedConfig);
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  const handleExport = async (format: 'csv' | 'txt' | 'xls') => {
    try {
      await exportConfig(config, format);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Data Import/Export</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="import">Import Configuration</Label>
          <Input
            id="import"
            type="file"
            accept=".csv,.txt,.xls,.xlsx"
            onChange={handleImport}
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Export Configuration</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={disabled}
              className="flex-1"
            >
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('txt')}
              disabled={disabled}
              className="flex-1"
            >
              TXT
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('xls')}
              disabled={disabled}
              className="flex-1"
            >
              XLS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
