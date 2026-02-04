import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { TransactionForm } from "./TransactionForm";
import type { ActionResponse } from "@/types";
import type { Transaction, TransactionInput } from "@/schemas/transaction";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransactionActionDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (isOpen: boolean) => void;
  /** Initial data for edit mode */
  initialData?: Transaction | null;
  /** Submit handler */
  onSubmit: (data: TransactionInput) => ActionResponse;
  /** Optional callback when dialog closes */
  onClose?: () => void;
}

/**
 * Transaction Action Dialog
 *
 * Wrapper component that manages the dialog state and renders the TransactionForm.
 * Follows the same pattern as CategoryActionDialog.
 *
 * Supports both create and edit modes based on initialData presence.
 * Uses Drawer on mobile (bottom sheet) and Dialog on desktop (centered modal).
 */
export const TransactionActionDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  onClose,
}: TransactionActionDialogProps) => {
  const isMobile = useIsMobile();
  const handleSuccess = () => {
    onOpenChange(false);
    onClose?.();
  };

  // Mobile: use Drawer (bottom sheet)
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <div className="overflow-y-auto max-h-[85vh] px-1">
            <TransactionForm
              initialData={initialData ?? undefined}
              onSubmit={onSubmit}
              onSuccess={handleSuccess}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: use Dialog (centered modal)
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-md max-h-[90vh] p-6 gap-0">
        <div className="overflow-y-auto max-h-[90vh] pr-2">
          <TransactionForm
            initialData={initialData ?? undefined}
            onSubmit={onSubmit}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
