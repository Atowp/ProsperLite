import { Dialog, DialogContent } from "@ui/dialog";
import { LedgerForm } from "./LedgerForm";
import type { ActionResponse } from "@/types";
import type { Ledger, LedgerInput } from "@/schemas";

interface LedgerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Ledger | null;
  onSubmit: (data: LedgerInput) => ActionResponse;
  onClose?: () => void;
}

export const LedgerActionDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  onClose,
}: LedgerDialogProps) => {
  const handleSuccess = () => {
    onOpenChange(false);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <LedgerForm
          initialData={initialData ?? undefined}
          onSubmit={onSubmit}
          onSuccess={handleSuccess}
        ></LedgerForm>
      </DialogContent>
    </Dialog>
  );
};
