import { useStore } from "@/store/useStore";
import { CategoryItem } from "./Item";
import { ScrollArea } from "@ui/scroll-area";

export function CategoryList() {
  const { categories, updateCategory, deleteCategory } = useStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold mr-2">Categories</h3>
          <span className="text-xs text-muted-foreground">
            ({categories.length})
          </span>
        </div>
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
