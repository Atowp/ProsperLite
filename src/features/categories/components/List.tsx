import { useStore } from "@/store/useStore";
import { CategoryItem } from "./ui/Item";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CategoryList() {
  const { categories, updateCategory, deleteCategory } = useStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold">Categories</h3>
        <p className="text-xs text-muted-foreground mr-4">
          Total {categories.length} categories
        </p>
      </div>

      <ScrollArea className="h-100 pr-4">
        <div className="grid gap-2">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={(c) => updateCategory(c.id, c)}
              onDelete={(id) => deleteCategory(id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
