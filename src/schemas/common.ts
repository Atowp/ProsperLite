import { z } from "zod";

export const validName = (fieldName: string) =>
  z
    .string()
    .regex(
      /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/,
      `${fieldName} must contain only letters, numbers, and spaces.`
    );

export const requiredString = (fieldName: string, schema?: z.ZodString) => {
  const defaultSchema = schema ? schema : z.string();
  return defaultSchema.trim().min(1, `${fieldName} cannot be empty.`);
};
