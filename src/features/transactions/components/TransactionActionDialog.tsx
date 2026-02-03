import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import type { ActionResponse } from "@/types";
import type { Transaction, TransactionInput } from "@/schemas/transaction";

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
 */
export const TransactionActionDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  onClose,
}: TransactionActionDialogProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-md max-h-[90vh] p-6 gap-0">
        <TransactionForm
          initialData={initialData ?? undefined}
          onSubmit={onSubmit}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
