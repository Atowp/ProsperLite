import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { MonthlyLimitSchema } from "@/schemas";
import { toast } from "sonner";

export function MonthlyLimitSection() {
  const { monthlyLimit, updateMonthlyLimit } = useStore();
  const [amount, setAmount] = useState(monthlyLimit.toFixed(2));

  const handleSave = () => {
    const value = parseFloat(amount);

    // Validate using Zod schema
    const result = MonthlyLimitSchema.safeParse({ amount: value });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    updateMonthlyLimit({ amount: value });
    toast.success("Monthly limit updated successfully");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Monthly Budget Limit</h3>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm w-400">
          <Input
            id="monthly-limit"
            type="number"
            step="0.01"
            min="0"
            max="999999999"
            placeholder="5000.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </p>
        <Button onClick={handleSave} className="px-4 py-2 mr-4">
          Save
        </Button>
      </div>
    </div>
  );
}
