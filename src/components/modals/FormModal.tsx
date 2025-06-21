
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  maxWidth?: string;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Salvar",
  cancelText = "Cancelar",
  isLoading = false,
  maxWidth = "max-w-md"
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {children}
        </div>
        {onSubmit && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button onClick={onSubmit} disabled={isLoading}>
              {isLoading ? "Salvando..." : submitText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
