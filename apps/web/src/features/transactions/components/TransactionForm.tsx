/**
 * Transaction Form
 *
 * A transaction entry/edit form with:
 * - Income/Expense toggle
 * - Amount input with quick presets
 * - Date picker
 * - Category/Ledger selection
 * - Optional remark
 * - Enter key navigation
 * - Edit mode support
 *
 * Architecture:
 * - Follows ADR: Zustand for state, Zod for validation
 * - Uses react-hook-form for form management
 * - Supports both create and edit modes
 */

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { useRecentTransaction } from "../hooks/useRecentTransaction";
import { useDecimalInputLimit } from "@/hooks/use-decimal-input-limit";
import {
  CreateTransactionSchema,
  type TransactionInput,
  type Transaction,
} from "@/schemas/transaction";
import { QUICK_AMOUNTS } from "@/constants/config";
import { toast } from "sonner";
import { cn } from "@/lib/ui";
import dayjs from "@/lib/dayjs";
import type { ActionResponse } from "@/types";

interface TransactionFormProps {
  /** Initial data for edit mode */
  initialData?: Transaction;
  /** Submit handler */
  onSubmit: (data: TransactionInput) => ActionResponse;
  /** Callback when form is successfully submitted */
  onSuccess?: () => void;
}

/**
 * TransactionForm Component (Memo Optimized)
 *
 * Supports both create and edit modes based on initialData presence.
 */
export const TransactionForm = memo(function TransactionForm({
  initialData,
  onSubmit,
  onSuccess,
}: TransactionFormProps) {
  const { categories, ledgers } = useStore();
  const { categoryId: defaultCategoryId, ledgerId: defaultLedgerId } =
    useRecentTransaction();

  const isEditMode = !!initialData;

  // Local state for amount display and keypad
  const [amountBuffer, setAmountBuffer] = useState<string>(
    initialData ? initialData.amount.toString() : ""
  );
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    initialData?.type || "expense"
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialData ? new Date(initialData.date) : new Date()
  );

  // Refs for focus management and keyboard navigation
  const amountInputRef = useRef<HTMLInputElement>(null);
  const datePopoverTriggerRef = useRef<HTMLButtonElement>(null);
  const remarkInputRef = useRef<HTMLInputElement>(null);

  // Form setup with Zod validation (mode: onSubmit to validate only on submit)
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionInput>({
    resolver: zodResolver(CreateTransactionSchema),
    mode: "onSubmit", // Only validate on submit, not during typing
    defaultValues: {
      amount: initialData?.amount || 0,
      type: initialData?.type || "expense",
      categoryId: initialData?.categoryId || defaultCategoryId,
      ledgerId: initialData?.ledgerId || defaultLedgerId,
      date: initialData?.date || new Date().toISOString(),
      remark: initialData?.remark || "",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      setAmountBuffer(initialData.amount.toString());
      setTransactionType(initialData.type);
      setSelectedDate(new Date(initialData.date));
      reset({
        amount: initialData.amount,
        type: initialData.type,
        categoryId: initialData.categoryId,
        ledgerId: initialData.ledgerId,
        date: initialData.date,
        remark: initialData.remark || "",
      });
    } else {
      setAmountBuffer("");
      setTransactionType("expense");
      setSelectedDate(new Date());
      reset({
        amount: 0,
        type: "expense",
        categoryId: defaultCategoryId,
        ledgerId: defaultLedgerId,
        date: new Date().toISOString(),
        remark: "",
      });
    }
  }, [initialData, defaultCategoryId, defaultLedgerId, reset]);

  // Hook to limit decimal input to 2 places
  const handleDecimalLimit = useDecimalInputLimit(2);

  /**
   * Auto-focus amount field when form mounts
   */
  useEffect(() => {
    setTimeout(() => {
      amountInputRef.current?.focus();
    }, 100);
  }, []);

  /**
   * Handle quick amount button click
   */
  const handleQuickAmount = useCallback(
    (amount: number) => {
      setValue("amount", amount, { shouldValidate: false });
      setAmountBuffer(amount.toString());
      // Move focus to date field
      datePopoverTriggerRef.current?.focus();
    },
    [setValue]
  );

  /**
   * Handle form submission
   */
  const onFormSubmit = useCallback(
    async (data: TransactionInput) => {
      // Validate amount before submission
      const amount = parseFloat(amountBuffer || "0");
      if (amount <= 0) {
        toast.error("Please enter a valid amount");
        amountInputRef.current?.focus();
        return;
      }

      // Update type and amount before submission
      const transactionData = {
        ...data,
        type: transactionType,
        amount: amount,
      };

      const result = onSubmit(transactionData);

      if (result.success) {
        toast.success(
          isEditMode
            ? "Transaction updated successfully"
            : "Transaction added successfully"
        );
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to save transaction");
      }
    },
    [onSubmit, transactionType, amountBuffer, isEditMode, onSuccess]
  );

  /**
   * Handle Enter key navigation
   * amount → date → remark → submit
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, nextField?: "date" | "remark" | "submit") => {
      if (e.key === "Enter") {
        e.preventDefault();

        if (nextField === "date") {
          datePopoverTriggerRef.current?.focus();
        } else if (nextField === "remark") {
          remarkInputRef.current?.focus();
        } else if (nextField === "submit") {
          handleSubmit(onFormSubmit)();
        }
      }
    },
    [handleSubmit, onFormSubmit]
  );

  /**
   * Render category/ledger selection
   * - ≤6 items: Radio grid (like quick amounts)
   * - >6 items: Select dropdown
   */
  const renderCategorySelection = () => {
    if (categories.length <= 6) {
      return (
        <div className="grid grid-cols-3 gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              variant={
                watch("categoryId") === category.id ? "default" : "outline"
              }
              size="sm"
              onClick={() => setValue("categoryId", category.id)}
              title={category.name}
            >
              <span className="truncate px-2">{category.name}</span>
            </Button>
          ))}
        </div>
      );
    }
    return (
      <Select
        value={watch("categoryId")}
        onValueChange={(value) => setValue("categoryId", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const renderLedgerSelection = () => {
    if (ledgers.length <= 6) {
      return (
        <div className="grid grid-cols-3 gap-2">
          {ledgers.map((ledger) => (
            <Button
              key={ledger.id}
              type="button"
              variant={watch("ledgerId") === ledger.id ? "default" : "outline"}
              size="sm"
              onClick={() => setValue("ledgerId", ledger.id)}
              title={ledger.name}
            >
              <span className="truncate px-2">{ledger.name}</span>
            </Button>
          ))}
        </div>
      );
    }
    return (
      <Select
        value={watch("ledgerId")}
        onValueChange={(value) => setValue("ledgerId", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select ledger" />
        </SelectTrigger>
        <SelectContent>
          {ledgers.map((ledger) => (
            <SelectItem key={ledger.id} value={ledger.id}>
              {ledger.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Edit" : "Add"} Transaction</DialogTitle>
        <DialogDescription>
          {isEditMode
            ? "Update the transaction details below"
            : "Quickly add a new income or expense record"}
        </DialogDescription>
      </DialogHeader>

      <FieldGroup className="mb-8 mt-4">
        {/* Type Toggle: Income / Expense */}
        <Field>
          <FieldLabel>Transaction Type</FieldLabel>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={transactionType === "expense" ? "default" : "outline"}
              className={cn(
                "flex-1",
                transactionType === "expense" && "bg-red-500 hover:bg-red-600"
              )}
              onClick={() => setTransactionType("expense")}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={transactionType === "income" ? "default" : "outline"}
              className={cn(
                "flex-1",
                transactionType === "income" &&
                  "bg-green-500 hover:bg-green-600"
              )}
              onClick={() => setTransactionType("income")}
            >
              Income
            </Button>
          </div>
        </Field>

        {/* Amount Input with Quick Amounts */}
        <Field>
          <FieldLabel htmlFor="amount">Amount</FieldLabel>

          {/* Quick amount presets - above amount input (only for create mode) */}
          {!isEditMode && (
            <div className="grid grid-cols-6 gap-2 mb-2">
              {QUICK_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(amount)}
                  className="text-xs"
                >
                  {amount}
                </Button>
              ))}
            </div>
          )}

          <Input
            id="amount"
            ref={amountInputRef}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amountBuffer}
            onChange={(e) => {
              setAmountBuffer(e.target.value);
              // Don't validate during typing
              setValue("amount", parseFloat(e.target.value) || 0, {
                shouldValidate: false,
              });
            }}
            onKeyDown={(e) => {
              // First apply decimal limit
              handleDecimalLimit(e);
              // Then handle Enter key navigation
              handleKeyDown(e, "date");
            }}
            className="text-lg font-semibold"
          />
        </Field>

        {/* Date Picker - Popover + Calendar */}
        <Field>
          <FieldLabel>Date</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                ref={datePopoverTriggerRef}
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal pl-2.5",
                  !selectedDate && "text-muted-foreground"
                )}
                onKeyDown={(e) => handleKeyDown(e, "remark")}
              >
                {selectedDate
                  ? dayjs(selectedDate).format("YYYY-MM-DD")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setValue("date", date.toISOString(), {
                      shouldValidate: false,
                    });
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <p className="text-xs text-destructive mt-1">
              {errors.date.message}
            </p>
          )}
        </Field>

        {/* Category Selection */}
        <Field>
          <FieldLabel>Category</FieldLabel>
          {renderCategorySelection()}
          {errors.categoryId && (
            <p className="text-xs text-destructive mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </Field>

        {/* Ledger Selection */}
        <Field>
          <FieldLabel>Ledger</FieldLabel>
          {renderLedgerSelection()}
          {errors.ledgerId && (
            <p className="text-xs text-destructive mt-1">
              {errors.ledgerId.message}
            </p>
          )}
        </Field>

        {/* Remark (Optional) */}
        <Field>
          <FieldLabel htmlFor="remark">Remark (Optional)</FieldLabel>
          <Input
            id="remark"
            placeholder="Add a note..."
            {...register("remark")}
            onKeyDown={(e) => handleKeyDown(e, "submit")}
          />
          {errors.remark && (
            <p className="text-xs text-destructive mt-1">
              {errors.remark.message}
            </p>
          )}
        </Field>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="px-4 py-2">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 mb-2"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
});
