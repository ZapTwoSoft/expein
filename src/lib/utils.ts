import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency with smart number formatting:
 * - Uses "K" notation for thousands (e.g., 30K instead of 30,000)
 * - Hides decimal points if they are .00
 * - Preserves significant decimals
 */
export function formatCurrency(amount: number, options?: { prefix?: string; showSign?: boolean }): string {
  const { prefix = 'BDT', showSign = false } = options || {};
  const absAmount = Math.abs(amount);
  const sign = showSign ? (amount >= 0 ? '+' : '-') : '';
  
  let formatted: string;
  
  // For amounts >= 1000, use K notation
  if (absAmount >= 1000) {
    const inK = absAmount / 1000;
    // Show decimal only if it's not .00
    const numFormatted = inK % 1 === 0 ? inK.toFixed(0) : inK.toFixed(2);
    formatted = `${numFormatted}K`;
  } else {
    // For amounts < 1000, show as is but hide .00
    formatted = absAmount % 1 === 0 
      ? absAmount.toFixed(0) 
      : absAmount.toFixed(2);
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
