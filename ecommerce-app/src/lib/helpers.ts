/**
 * Format a number as USD currency string.
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Calculate discounted price given original price and discount percentage.
 */
export function calcDiscountedPrice(originalPrice: number, discountPercentage: number): number {
  return originalPrice * (1 - discountPercentage / 100);
}

/**
 * Truncate text to a maximum length, appending ellipsis if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}
