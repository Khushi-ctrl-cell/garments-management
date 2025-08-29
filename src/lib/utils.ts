import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency conversion utilities
const USD_TO_INR_RATE = 83;

export function usdToInr(usdAmount: number): number {
  return usdAmount * USD_TO_INR_RATE;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function calculateGST(amount: number): { subtotal: number; gst: number; total: number } {
  const subtotal = amount;
  const gst = subtotal * 0.05; // 5% GST
  const total = subtotal + gst;
  
  return { subtotal, gst, total };
}

export function formatINRFromUSD(usdAmount: number): string {
  return formatINR(usdToInr(usdAmount));
}
