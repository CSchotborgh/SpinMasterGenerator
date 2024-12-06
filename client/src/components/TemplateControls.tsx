import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { predefinedTemplates, WheelTemplate, applyTemplate, createCustomTemplate } from "../lib/templates";
import type { WheelConfig } from "../pages/Home";
import { useState } from "react";

interface TemplateControlsProps {
  config: WheelConfig;
  onConfigChange: (config: WheelConfig) => void;
  disabled: boolean;
}

export function TemplateControls({ config, onConfigChange, disabled }: TemplateControlsProps) {
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [customTemplates, setCustomTemplates] = useState<WheelTemplate[]>([]);

  const handleTemplateSelect = (templateId: string) => {
    const allTemplates = [...predefinedTemplates, ...customTemplates];
    const template = allTemplates.find(t => t.id === templateId);
    if (template) {
      const newConfig = applyTemplate(config, template);
      onConfigChange(newConfig);
    }
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName) return;

    const template = createCustomTemplate(
      newTemplateName,
      newTemplateDescription,
      config
    );

    setCustomTemplates([...customTemplates, template]);
    setNewTemplateName("");
    setNewTemplateDescription("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Templates</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Load Template</Label>
          <Select onValueChange={handleTemplateSelect} disabled={disabled}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Game Templates</SelectLabel>
                {predefinedTemplates
                  .filter(t => t.category === 'game')
                  .map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Education Templates</SelectLabel>
                {predefinedTemplates
                  .filter(t => t.category === 'education')
                  .map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Business Templates</SelectLabel>
                {predefinedTemplates
                  .filter(t => t.category === 'business')
                  .map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
              {customTemplates.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Custom Templates</SelectLabel>
                  {customTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" disabled={disabled}>
              Save as Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save Template</DialogTitle>
              <DialogDescription>
                Create a new template from the current wheel configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Enter template name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Enter template description"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" onClick={handleSaveTemplate}>
                  Save Template
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
