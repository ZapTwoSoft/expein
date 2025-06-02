import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ConfirmationPopoverProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export function ConfirmationPopover({
  children,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  disabled = false,
}: ConfirmationPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{title}</h4>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirm}
              disabled={disabled}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 