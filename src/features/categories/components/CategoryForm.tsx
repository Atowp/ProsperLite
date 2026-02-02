import type { ActionResponse } from "@/types";
import type { Category, CategoryInput } from "../types";
import { Controller, useForm } from "react-hook-form";
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
import { CategorySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryIconPicker } from "./CategoryIconPicker";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryInput) => ActionResponse;
  onSuccess?: () => void;
}
export function CategoryForm({ initialData, onSubmit, onSuccess }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || { name: "", iconKey: "default" },
  });
  // const [selectedIcon, setSelectedIcon] = useState("default");

  useEffect(() => {
    reset(initialData || { name: "", iconKey: "default" });
  }, [initialData, reset]);

  const onFormSubmit = async (data: CategoryInput) => {
    const res = await onSubmit(data);

    if (res.success) {
      toast.success(
        initialData ? "Category updated successfully" : "Category added successfully"
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
        <DialogTitle>{initialData ? "Edit" : "Add"} Category</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <FieldGroup className="mb-4 mt-4">
        <Field>
          <Label>Icon</Label>
          <Controller
            name="iconKey"
            control={control}
            render={({ field }) => (
              <CategoryIconPicker
                value={field.value}
                onChange={field.onChange}
                error={!!errors.iconKey}
              />
            )}
          />
          {errors.iconKey && (
            <p className="text-xs font-medium text-destructive">
              {errors.iconKey.message}
            </p>
          )}
        </Field>
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
