/**
 * Number keypad configuration
 * Configuration-driven layout for the quick add number keypad
 * Layout: 4 columns grid
 * - Left: 3x4 number grid (1-9, 0, .)
 * - Right: Backspace (1 cell) + Confirm (2 cells vertical)
 */

/**
 * Icon type for special keys
 */
export type KeypadIcon = "backspace" | "confirm";

/**
 * Individual key definition
 */
export interface KeypadKey {
  /** Display label for the key */
  label: string;
  /** Icon for special keys (backspace, confirm) */
  icon?: KeypadIcon;
  /** Value to insert into buffer */
  value: string;
  /** CSS class for grid positioning */
  className: string;
  /** Action type */
  action: "number" | "decimal" | "backspace" | "confirm";
  /** Keyboard key that triggers this action */
  keyboardKey?: string;
}

/**
 * Complete keypad layout configuration
 * Grid layout: 4 columns
 */
export const KEYPAD_LAYOUT: KeypadKey[][] = [
  // Row 1: 1, 2, 3, Backspace
  [
    { label: "1", value: "1", className: "col-span-1", action: "number", keyboardKey: "1" },
    { label: "2", value: "2", className: "col-span-1", action: "number", keyboardKey: "2" },
    { label: "3", value: "3", className: "col-span-1", action: "number", keyboardKey: "3" },
    { label: "", icon: "backspace", value: "backspace", className: "col-span-1 row-span-1", action: "backspace", keyboardKey: "Backspace" },
  ],
  // Row 2: 4, 5, 6, Confirm (spans 2 rows)
  [
    { label: "4", value: "4", className: "col-span-1", action: "number", keyboardKey: "4" },
    { label: "5", value: "5", className: "col-span-1", action: "number", keyboardKey: "5" },
    { label: "6", value: "6", className: "col-span-1", action: "number", keyboardKey: "6" },
    { label: "", icon: "confirm", value: "confirm", className: "col-span-1 row-span-2 bg-primary text-primary-foreground hover:bg-primary/90", action: "confirm", keyboardKey: "Enter" },
  ],
  // Row 3: 7, 8, 9, (empty - Confirm spans)
  [
    { label: "7", value: "7", className: "col-span-1", action: "number", keyboardKey: "7" },
    { label: "8", value: "8", className: "col-span-1", action: "number", keyboardKey: "8" },
    { label: "9", value: "9", className: "col-span-1", action: "number", keyboardKey: "9" },
    // Confirm button occupies this cell from row 2
  ],
  // Row 4: ., 0, 00, (empty - Confirm spans)
  [
    { label: ".", value: ".", className: "col-span-1", action: "decimal", keyboardKey: "." },
    { label: "0", value: "0", className: "col-span-1", action: "number", keyboardKey: "0" },
    { label: "00", value: "00", className: "col-span-1", action: "number" },
    // Empty cell
  ],
];

/**
 * Keyboard event mapping for physical keyboard support
 */
export const KEYBOARD_MAP: Record<string, KeypadKey["action"]> = {
  "0": "number",
  "1": "number",
  "2": "number",
  "3": "number",
  "4": "number",
  "5": "number",
  "6": "number",
  "7": "number",
  "8": "number",
  "9": "number",
  ".": "decimal",
  "Backspace": "backspace",
  "Enter": "confirm",
  "Delete": "backspace",
};
