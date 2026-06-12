import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extends short meta descriptions to meet the optimal SEO length (110-160 characters).
 */
export function extendMetaDescription(desc: string | null | undefined, fallbackSuffix: string): string {
  if (!desc) return "";
  const cleanDesc = desc.trim();
  if (cleanDesc.length >= 115) return cleanDesc; // Already within or near optimal range
  
  const spaceLeft = 155 - cleanDesc.length;
  if (spaceLeft < 25) return cleanDesc; // Not enough space for a useful addition
  
  if (fallbackSuffix.length <= spaceLeft) {
    return `${cleanDesc} ${fallbackSuffix}`;
  }
  
  const shorterSuffix = "Read our full verdict, pricing plans, and feature comparisons.";
  if (shorterSuffix.length <= spaceLeft) {
    return `${cleanDesc} ${shorterSuffix}`;
  }
  
  const minimalSuffix = "Read our full review and analysis.";
  if (minimalSuffix.length <= spaceLeft) {
    return `${cleanDesc} ${minimalSuffix}`;
  }
  
  return cleanDesc;
}
