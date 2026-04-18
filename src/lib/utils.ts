import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { brand } from "./brand";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatInr(paise: number): string {
  const rupees = paise / 100;
  return `${brand.currencySymbol}${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function paiseFromRupees(rupees: number): number {
  return Math.round(rupees * 100);
}
