import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate years of TV experience starting from July 18, 2023
 * Returns the number of complete years
 */
export function getYearsOfExperience(): number {
  const startDate = new Date("2023-07-18");
  const now = new Date();

  let years = now.getFullYear() - startDate.getFullYear();

  // Adjust if we haven't reached the anniversary this year yet
  const monthDiff = now.getMonth() - startDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < startDate.getDate())) {
    years--;
  }

  return years;
}
