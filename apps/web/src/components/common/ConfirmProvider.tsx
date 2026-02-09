import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/alert-dialog";
import { useConfirmStore } from "@/hooks/use-confirm-store";
import { Spinner } from "../ui/spinner";

export const ConfirmProvider = () => {
  const { isOpen, isLoading, title, description, onConfirm, close } =
    useConfirmStore();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={close}>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="p-4" disabled={isLoading}>
            {isLoading && <Spinner data-icon="inline-start" />}Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 p-4 text-white"
            disabled={isLoading}
          >
            {isLoading && <Spinner data-icon="inline-start" />}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
