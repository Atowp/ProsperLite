import { Dialog, DialogContent } from "@ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { LedgerForm } from "./LedgerForm";
import type { ActionResponse } from "@/types";
import type { Ledger, LedgerInput } from "@/schemas";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const handleSuccess = () => {
    onOpenChange(false);
    onClose?.();
  };

  // Mobile: use Drawer (bottom sheet)
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="px-1 overflow-y-auto max-h-[85vh]">
            <LedgerForm
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
      <DialogContent className="sm:max-w-sm">
        <LedgerForm
          initialData={initialData ?? undefined}
          onSubmit={onSubmit}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
