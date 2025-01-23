import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import type { SpinHistory as SpinHistoryType } from "../types/SpinHistory";

interface SpinHistoryProps {
  history: SpinHistoryType;
  onClearHistory: () => void;
  onExportHistory: () => void;
}

export function SpinHistory({ history, onClearHistory, onExportHistory }: SpinHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Spin History</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExportHistory}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearHistory}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[300px] rounded-md border p-4">
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground">No spins recorded yet</p>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col space-y-1 border-b border-border pb-3 last:border-0"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{entry.sliceLabel}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Slice {entry.selectedSlice + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
