import { z } from "zod";

export const MonthlyLimitSchema = z.object({
  amount: z
    .number()
    .min(0, "Amount must be positive")
    .max(999999999, "Amount exceeds maximum limit"),
});

export type MonthlyLimitInput = z.infer<typeof MonthlyLimitSchema>;
