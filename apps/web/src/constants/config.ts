/**
 * Quick add transaction configuration
 * Centralized configuration for quick amounts and transaction defaults
 */

// Quick amount presets for fast transaction entry
export const QUICK_AMOUNTS = [10, 20, 50, 100, 200, 500] as const;

/**
 * Transaction type options for toggle
 */
export const TRANSACTION_TYPES = ["income", "expense"] as const;

/**
 * Maximum decimal places for amount input
 */
export const AMOUNT_DECIMAL_PLACES = 2;

/**
 * Minimum amount allowed
 */
export const MIN_AMOUNT = 0.01;

/**
 * Maximum amount allowed
 */
export const MAX_AMOUNT = 100000000;
