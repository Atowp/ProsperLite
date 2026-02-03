/**
 * Number Keypad Component
 *
 * Features:
 * - Maintains internal string Buffer to handle leading zeros (e.g., "0.01")
 * - Converts to number only on onComplete via parseFloat
 * - Full keyboard support: number keys, Enter, Backspace, Delete
 * - Memo optimized for zero-latency input
 * - Prevents focus loss when clicking buttons
 * - Configuration-driven layout from @/components/keypad/config.ts
 * - Decimal place limiting
 */

import { memo, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/ui";
import { KEYPAD_LAYOUT, KEYBOARD_MAP } from "./config";
import { Delete, Check } from "lucide-react";

interface NumberKeypadProps {
  /** Callback when keypad confirms the input */
  onComplete: (value: number) => void;
  /** Callback when value changes (optional, for live preview) */
  onChange?: (value: string) => void;
  /** Enable/disable global keyboard event listener */
  enableKeyboard?: boolean;
  /** Maximum decimal places allowed (default: 2) */
  maxDecimalPlaces?: number;
  /** CSS class name */
  className?: string;
}

/**
 * NumberKeypad Component
 *
 * Internal Buffer is a string to properly handle:
 * - Leading zeros: "0.01"
 * - Multiple decimals during input: "12.3"
 * - Empty state: ""
 *
 * Only converts to number when onComplete is triggered.
 */
export const NumberKeypad = memo(function NumberKeypad({
  onComplete,
  onChange,
  enableKeyboard = true,
  maxDecimalPlaces = 2,
  className,
}: NumberKeypadProps) {
  // Internal string buffer to handle leading zeros and decimals
  const bufferRef = useRef<string>("");

  /**
   * Render icon based on icon type
   */
  const renderIcon = useCallback((icon?: "backspace" | "confirm") => {
    if (icon === "backspace") return <Delete className="h-5 w-5" />;
    if (icon === "confirm") return <Check className="h-6 w-6" />;
    return null;
  }, []);

  /**
   * Handle key press from UI button or physical keyboard
   */
  const handleKeyPress = useCallback(
    (action: string, value: string) => {
      const buffer = bufferRef.current;

      switch (action) {
        case "number":
        case "decimal":
          // Handle decimal point: only allow one
          if (value === ".") {
            if (buffer.includes(".")) return;
            // Prepend 0 if starts with decimal
            bufferRef.current = buffer === "" ? "0." : buffer + ".";
          } else if (value === "00") {
            // Handle double-zero with decimal limit check
            if (buffer.includes(".")) {
              const decimalPart = buffer.split(".")[1];
              if (decimalPart && decimalPart.length >= maxDecimalPlaces) {
                return; // Already at max decimal places
              }
              // Add zeros one at a time to respect limit
              const remaining = maxDecimalPlaces - (decimalPart?.length || 0);
              bufferRef.current = buffer + "0".repeat(Math.min(2, remaining));
            } else {
              bufferRef.current = buffer === "" ? "0" : buffer + "00";
            }
          } else {
            // Regular number with decimal limit check
            if (buffer.includes(".")) {
              const decimalPart = buffer.split(".")[1];
              if (decimalPart && decimalPart.length >= maxDecimalPlaces) {
                return; // Already at max decimal places
              }
            }
            bufferRef.current = buffer + value;
          }
          break;

        case "backspace":
          // Delete last character
          bufferRef.current = buffer.slice(0, -1);
          break;

        case "confirm":
          // Convert buffer to number and complete
          const numValue = parseFloat(buffer || "0");
          if (numValue > 0) {
            onComplete(numValue);
            bufferRef.current = ""; // Clear buffer after success
          }
          return; // Don't trigger onChange after confirm
      }

      // Trigger onChange for live preview
      onChange?.(bufferRef.current);
    },
    [onComplete, onChange, maxDecimalPlaces]
  );

  /**
   * Global keyboard event listener
   * Supports physical keyboard input when dialog is open
   */
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return; // Let input handle it
      }

      const key = e.key;
      const action = KEYBOARD_MAP[key];

      if (action) {
        e.preventDefault(); // Prevent default behavior
        const value =
          key === "Backspace" || key === "Delete" || key === "Enter" ? "" : key;
        handleKeyPress(action, value);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, handleKeyPress]);

  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {KEYPAD_LAYOUT.flat().map((key, index) => {
        // Skip empty cells (spanned by other buttons)
        if (!key.label && !key.icon) return null;

        return (
          <Button
            key={index}
            type="button"
            variant={key.action === "confirm" ? "default" : "outline"}
            className={cn(
              "h-14 text-lg font-medium transition-all hover:scale-105 active:scale-95",
              key.className,
              key.action === "number" &&
                "hover:bg-accent hover:text-accent-foreground",
              key.action === "decimal" &&
                "hover:bg-accent hover:text-accent-foreground",
              key.action === "backspace" &&
                "hover:bg-destructive hover:text-destructive-foreground"
            )}
            onPointerDown={(e) => {
              // Prevent focus loss on mobile and desktop
              e.preventDefault();
            }}
            onClick={() => handleKeyPress(key.action, key.value)}
          >
            {key.icon ? renderIcon(key.icon) : key.label}
          </Button>
        );
      })}
    </div>
  );
});
