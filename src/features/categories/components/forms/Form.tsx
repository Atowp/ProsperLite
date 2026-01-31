import type { ActionResponse } from "@/types";
import type { Category, CategoryInput } from "../../types";
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
import { CategorySchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryInput) => ActionResponse;
}
export function CategoryForm({ initialData, onSubmit }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || { name: "", iconKey: "default" },
  });

  useEffect(() => {
    reset(initialData || { name: "", iconKey: "default" });
  }, [initialData, reset]);

  const onFormSubmit = async (data: CategoryInput) => {
    const res = await onSubmit(data);

    // 2. 将 Store 返回的业务错误（如重名）手动映射到 Zod 错误池中
    if (!res.success) {
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
          <Label htmlFor="name-1">Name</Label>
          <Input
            id="name-1"
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
