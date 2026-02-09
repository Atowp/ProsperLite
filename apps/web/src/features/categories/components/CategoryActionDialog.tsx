import { Dialog, DialogContent } from "@ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { CategoryForm } from "./CategoryForm";
import type { ActionResponse } from "@/types";
import type { Category, CategoryInput } from "@/schemas";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Category | null;
  onSubmit: (data: CategoryInput) => ActionResponse;
  onClose?: () => void;
}

export const CategoryActionDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  onClose,
}: CategoryDialogProps) => {
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
            <CategoryForm
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
        <CategoryForm
          initialData={initialData ?? undefined}
          onSubmit={onSubmit}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
