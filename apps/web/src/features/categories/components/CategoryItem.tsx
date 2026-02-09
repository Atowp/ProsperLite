import { Button } from "@ui/button";
import Edit2Icon from "~icons/lucide/edit-2";
import Trash2Icon from "~icons/lucide/trash-2";
import type { ActionResponse } from "@/types";
import { ALL_CATEGORY_ICONS_MAP } from "../constants";
import { Badge } from "@ui/badge";
import { useConfirmStore } from "@/hooks/use-confirm-store";
import { toast } from "sonner";
import type { Category } from "@/schemas";
import { cn } from "@/lib/ui";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
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

  const handleItemClick = () => {
    // On mobile, tapping the item opens edit drawer
    if (isMobile) {
      onEdit(category);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group",
        isMobile && "cursor-pointer active:bg-accent"
      )}
      onClick={handleItemClick}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <span className="font-medium text-sm">{category.name}</span>
        {category.isSystem && <Badge>Default</Badge>}
      </div>

      {/* Actions - hidden on mobile, visible on desktop */}
      <div
        className={cn(
          "flex items-center gap-1 transition-opacity",
          isMobile ? "hidden" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
        >
          <Edit2Icon className="h-4 w-4" />
        </Button>

        {/* only show delete button for non-system categories */}
        {!category.isSystem && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
