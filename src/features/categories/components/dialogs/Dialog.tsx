import type { Category, CategoryInput } from "../../types";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import { Dialog, DialogContent, DialogHeader } from "@ui/dialog";
import { CategoryForm } from "../forms/Form";

interface CategoryDialogProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Category;
}

export const CategoryActionDialog = ({
  title,
  isOpen,
  onOpenChange,
  initialData,
}: CategoryDialogProps) => {
  const { updateCategory, addCategory } = useStore();
  const handleSubmit = (data: CategoryInput) => {
    const result = initialData
      ? updateCategory(initialData.id, data)
      : addCategory(data);
    if (result.success) {
      toast.success(initialData ? "Update success" : "Add success", {
        description: `Category "${title}" has been saved`,
      });
      onOpenChange(false);
    } else {
      toast.error(initialData ? "Update failed" : "Add failed", {
        description: result.message,
      });
    }
    return result;
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>{title}</DialogHeader>
        <CategoryForm
          initialData={initialData ?? undefined}
          onSubmit={handleSubmit}
        ></CategoryForm>
      </DialogContent>
    </Dialog>
  );
};
