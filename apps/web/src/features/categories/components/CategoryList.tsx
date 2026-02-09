import { useStore } from "@/store/useStore";
import { CategoryItem } from "./CategoryItem";
import { ScrollArea } from "@ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CategoryActionDialog } from "./CategoryActionDialog";
import { useState } from "react";
import type { Category, CategoryInput } from "@/schemas";

export function CategoryList() {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  const handleOpenDialog = (category?: Category) => {
    setEditCategory(category || null);
    setIsOpen(true);
    return {
      success: true,
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold mr-2">Categories</h3>
          <span className="text-xs text-muted-foreground">
            ({categories.length})
          </span>
        </div>
        <div className="mr-3">
          <Button
            variant="default"
            className="px-4"
            onClick={() => handleOpenDialog()}
          >
            Add
          </Button>
        </div>
      </div>

      <ScrollArea className="h-100 pr-4">
        <div className="grid gap-2">
          {categories.map((category: Category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={(c: Category) => handleOpenDialog(c)}
              onDelete={(id: string) => deleteCategory(id)}
            />
          ))}
        </div>
      </ScrollArea>

      <CategoryActionDialog
        key={editCategory?.id || "new"}
        initialData={editCategory}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={(data: CategoryInput) => {
          if (editCategory) {
            return updateCategory(editCategory.id, data);
          } else {
            return addCategory(data);
          }
        }}
      />
    </div>
  );
}
