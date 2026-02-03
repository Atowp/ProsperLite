import { Dialog, DialogContent } from "@ui/dialog";
import { CategoryForm } from "./CategoryForm";
import type { ActionResponse } from "@/types";
import type { Category, CategoryInput } from "@/schemas";

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
  const handleSuccess = () => {
    onOpenChange(false);
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <CategoryForm
          initialData={initialData ?? undefined}
          onSubmit={onSubmit}
          onSuccess={handleSuccess}
        ></CategoryForm>
      </DialogContent>
    </Dialog>
  );
};
