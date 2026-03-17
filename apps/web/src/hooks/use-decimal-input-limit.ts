/**
 * useDecimalInputLimit Hook
 *
 * Limits the number of decimal places in an input field.
 * Prevents typing more than the specified decimal places,
 * but allows navigation keys, backspace, and enter.
 *
 * @param maxDecimalPlaces - Maximum number of decimal places (default: 2)
 * @returns handleKeyDown function to pass to Input's onKeyDown prop
 *
 * @example
 * const handleKeyDown = useDecimalInputLimit(2);
 * <input type="number" onKeyDown={handleKeyDown} />
 */

export function useDecimalInputLimit(maxDecimalPlaces: number = 2) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;

    // Keys that should always be allowed
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Tab",
      "Home",
      "End",
    ];

    // Allow navigation and editing keys
    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Allow copy/paste shortcuts
    if (
      (e.ctrlKey || e.metaKey) &&
      ["a", "c", "v", "x"].includes(e.key.toLowerCase())
    ) {
      return;
    }

    // If decimal point exists and we've reached the limit, prevent input
    if (
      value.includes(".") &&
      value.split(".")[1].length >= maxDecimalPlaces
    ) {
      e.preventDefault();
    }
  };

  return handleKeyDown;
}
