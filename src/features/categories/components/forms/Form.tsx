import type { ActionResponse } from "@/types";
import type { Category, CategoryInput } from "../../types";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryInput) => ActionResponse;
}
export function CategoryForm({ initialData, onSubmit }: CategoryFormProps) {
  const { register, handleSubmit, reset } = useForm<CategoryInput>({
    defaultValues: initialData || { name: "", iconKey: "default" },
  });

  useEffect(() => {
    reset(initialData || { name: "", iconKey: "default" });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <input {...register("iconKey")} />
      <button type="submit">Submit</button>
    </form>
  );
}
