import type { Category, CategoryInput } from "../../types";
import { Dialog, DialogContent } from "@ui/dialog";
import { CategoryForm } from "../forms/Form";
import type { ActionResponse } from "@/types";

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Category | null;
  onSubmit: (data: CategoryInput) => ActionResponse;
}

export const CategoryActionDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
}: CategoryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <CategoryForm
          initialData={initialData ?? undefined}
          onSubmit={onSubmit}
        ></CategoryForm>
      </DialogContent>
    </Dialog>
  );
};
