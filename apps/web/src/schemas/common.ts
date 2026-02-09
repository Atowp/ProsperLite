import { z } from "@prosper/shared";

export const requiredString = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} cannot be empty.`);

export const validName = (fieldName: string, schema?: z.ZodString) => {
  const defaultSchema = schema ? schema : z.string();
  return defaultSchema.regex(
    /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/,
    `${fieldName} must contain only letters, numbers, and spaces.`
  );
};
