import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings2 } from "lucide-react";
import { WheelControls } from "./WheelControls";
import { TemplateControls } from "./TemplateControls";
import { RecordingControls } from "./RecordingControls";
import { FileControls } from "./FileControls";
import { SpinHistory } from "./SpinHistory";
import type { WheelConfig } from "../pages/Home";
import type { SpinHistory as SpinHistoryType } from "../types/SpinHistory";

interface SidePanelProps {
  config: WheelConfig;
  onConfigChange: (config: WheelConfig) => void;
  onSpin: () => void;
  isSpinning: boolean;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  spinHistory: SpinHistoryType;
  onClearHistory: () => void;
  onExportHistory: () => void;
}

export function SidePanel({
  config,
  onConfigChange,
  onSpin,
  isSpinning,
  isRecording,
  onStartRecording,
  onStopRecording,
  spinHistory,
  onClearHistory,
  onExportHistory,
}: SidePanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed right-4 top-4">
          <Settings2 className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="wheel-controls">
            <AccordionTrigger>Wheel Controls</AccordionTrigger>
            <AccordionContent>
              <WheelControls
                config={config}
                onConfigChange={onConfigChange}
                onSpin={onSpin}
                disabled={isSpinning}
                isSpinning={isSpinning}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="history">
            <AccordionTrigger>Spin History</AccordionTrigger>
            <AccordionContent>
              <SpinHistory
                history={spinHistory}
                onClearHistory={onClearHistory}
                onExportHistory={onExportHistory}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="templates">
            <AccordionTrigger>Templates</AccordionTrigger>
            <AccordionContent>
              <TemplateControls
                config={config}
                onConfigChange={onConfigChange}
                disabled={isSpinning}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="recording">
            <AccordionTrigger>Recording</AccordionTrigger>
            <AccordionContent>
              <RecordingControls
                isRecording={isRecording}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
                disabled={isSpinning}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data">
            <AccordionTrigger>Data Import/Export</AccordionTrigger>
            <AccordionContent>
              <FileControls
                config={config}
                onConfigChange={onConfigChange}
                disabled={isSpinning}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}