import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency with smart number formatting:
 * - Uses "T" notation for trillions (e.g., 1.5T)
 * - Uses "B" notation for billions (e.g., 2.3B)
 * - Uses "M" notation for millions (e.g., 5.7M)
 * - Uses "K" notation for amounts > 9 lakh (900,000)
 * - Shows full number with commas for amounts <= 9 lakh
 * - Hides decimal points if they are .00
 * - Preserves significant decimals (up to 2 places)
 * - Always shows minus sign for negative numbers
 * - Only shows plus sign for positive numbers if showSign is true
 */
export function formatCurrency(amount: number, options?: { prefix?: string; showSign?: boolean }): string {
  const { prefix = '৳', showSign = false } = options || {};
  const absAmount = Math.abs(amount);
  
  // Determine sign:
  // - Always show '-' for negative numbers
  // - Show '+' for positive numbers only if showSign is true
  const sign = amount < 0 ? '-' : (showSign && amount > 0 ? '+' : '');
  
  let formatted: string;
  
  // Format based on magnitude
  if (absAmount >= 1_000_000_000_000) {
    // Trillions (T)
    const value = absAmount / 1_000_000_000_000;
    const numFormatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
    formatted = `${numFormatted}T`;
  } else if (absAmount >= 1_000_000_000) {
    // Billions (B)
    const value = absAmount / 1_000_000_000;
    const numFormatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
    formatted = `${numFormatted}B`;
  } else if (absAmount >= 1_000_000) {
    // Millions (M)
    const value = absAmount / 1_000_000;
    const numFormatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
    formatted = `${numFormatted}M`;
  } else if (absAmount > 900_000) {
    // More than 9 lakh (900,000), use K notation
    const value = absAmount / 1_000;
    const numFormatted = value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
    formatted = `${numFormatted}K`;
  } else {
    // 9 lakh or less, show full number with commas
    formatted = absAmount % 1 === 0 
      ? absAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })
      : absAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  return `${sign}${prefix} ${formatted}`;
}

/**
 * Format currency with thousand separators (no K notation)
 * - Adds commas for readability
 * - Hides decimal points if they are .00
 */
export function formatCurrencyWithCommas(amount: number, options?: { prefix?: string }): string {
  const { prefix = '৳' } = options || {};
  const absAmount = Math.abs(amount);
  
  // Hide .00 but show other decimals
  const formatted = absAmount % 1 === 0 
    ? absAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })
    : absAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  return `${prefix}${formatted}`;
}
