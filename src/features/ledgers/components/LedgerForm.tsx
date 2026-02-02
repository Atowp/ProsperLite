import type { ActionResponse } from "@/types";
import type { Ledger, LedgerInput } from "../types";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LedgerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface LedgerFormProps {
  initialData?: Ledger;
  onSubmit: (data: LedgerInput) => ActionResponse;
  onSuccess?: () => void;
}
export function LedgerForm({ initialData, onSubmit, onSuccess }: LedgerFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LedgerInput>({
    resolver: zodResolver(LedgerSchema),
    defaultValues: initialData || { name: "" },
  });

  useEffect(() => {
    reset(initialData || { name: "" });
  }, [initialData, reset]);

  const onFormSubmit = async (data: LedgerInput) => {
    const res = await onSubmit(data);

    if (res.success) {
      toast.success(
        initialData ? "Ledger updated successfully" : "Ledger added successfully"
      );
      onSuccess?.();
    } else {
      if (res.message?.includes("exists")) {
        setError("name", { type: "manual", message: res.message });
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit" : "Add"} Ledger</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <FieldGroup className="mb-4 mt-4">
        <Field>
          <Label htmlFor="name-input">Name</Label>
          <Input
            id="name-input"
            {...register("name", { required: "Name is required" })}
            defaultValue={initialData?.name}
          />
          {errors.name && (
            <p className="text-xs font-medium text-destructive">
              {errors.name.message}
            </p>
          )}
        </Field>
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="p-4">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="p-4" disabled={isSubmitting}>
          Save
        </Button>
      </DialogFooter>
    </form>
  );
}
