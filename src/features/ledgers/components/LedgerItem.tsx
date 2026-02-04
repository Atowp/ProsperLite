import { Button } from "@ui/button";
import Edit2Icon from "~icons/lucide/edit-2";
import Trash2Icon from "~icons/lucide/trash-2";
import WalletIcon from "~icons/lucide/wallet";
import type { ActionResponse } from "@/types";
import { useConfirmStore } from "@/hooks/use-confirm-store";
import { toast } from "sonner";
import type { Ledger } from "@/schemas";
import { cn } from "@/lib/ui";
import { useIsMobile } from "@/hooks/use-mobile";

interface LedgerItemProps {
  ledger: Ledger;
  length: number;
  onEdit: (ledger: Ledger) => ActionResponse;
  onDelete: (id: string) => ActionResponse;
}

export function LedgerItem({
  ledger,
  length,
  onEdit,
  onDelete,
}: LedgerItemProps) {
  const isMobile = useIsMobile();
  const confirmStore = useConfirmStore();

  const handleDeleteClick = () => {
    confirmStore.confirm({
      description: `This action cannot be undone. This will permanently delete "${ledger.name}" from our servers.`,
      onConfirm: () => {
        const result: ActionResponse = onDelete(ledger.id);
        toast[result.success ? "success" : "error"](result.message);
      },
    });
  };

  const handleItemClick = () => {
    // On mobile, tapping the item opens edit drawer
    if (isMobile) {
      onEdit(ledger);
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
          <WalletIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{ledger.name}</span>
          <span className="text-xs text-muted-foreground">
            Balance: {(ledger.balance ?? 0).toFixed(2)}
          </span>
        </div>
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
            onEdit(ledger);
          }}
        >
          <Edit2Icon className="h-4 w-4" />
        </Button>

        {/* only show delete button for ledgers' length > 1 */}
        {length > 1 && ledger.balance === 0 && (
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
