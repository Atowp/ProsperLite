import { Button } from "@ui/button";
import { Edit2, Trash2 } from "lucide-react";
import type { ActionResponse } from "@/types";
import { ALL_CATEGORY_ICONS_MAP } from "../constants";
import { Badge } from "@ui/badge";
import { useConfirmStore } from "@/hooks/use-confirm-store";
import { toast } from "sonner";
import type { Category } from "@/schemas";

interface CategoryItemProps {
  category: Category;
  onEdit: (category: Category) => ActionResponse;
  onDelete: (id: string) => ActionResponse;
}

export function CategoryItem({
  category,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  const confirmStore = useConfirmStore();
  const IconComponent =
    ALL_CATEGORY_ICONS_MAP[
      category.iconKey as keyof typeof ALL_CATEGORY_ICONS_MAP
    ] || ALL_CATEGORY_ICONS_MAP.smile;

  const handleDeleteClick = () => {
    confirmStore.confirm({
      description: `This action cannot be undone. This will permanently delete "${category.name}" from our servers.`,
      onConfirm: () => {
        const result: ActionResponse = onDelete(category.id);
        toast[result.success ? "success" : "error"](result.message);
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <span className="font-medium text-sm">{category.name}</span>
        {category.isSystem && <Badge>Default</Badge>}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(category)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        {/* only show delete button for non-system categories */}
        {!category.isSystem && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-destructive"
            onClick={() => handleDeleteClick()}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
