import { capitalizeSetning } from "~/utils";

/**
 * Checks if a date is within a range of two dates (inclusive)
 * @param date The date to check
 * @param startDate The start date of the range
 * @param endDate The end date of the range
 * @returns boolean indicating if the date is within the range
 */
export function isDateWithinRange(
  date: Date,
  startDate: Date,
  endDate: Date,
): boolean {
  return (
    (date > startDate || isSameDate(date, startDate)) &&
    (date < endDate || isSameDate(date, endDate))
  );
}

/**
 * Checks if two dates are the same (comparing year, month, and day)
 * @param date1 First date to compare
 * @param date2 Second date to compare
 * @returns boolean indicating if the dates are the same
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function navnPåMåned(date: string) {
  const måned = new Intl.DateTimeFormat("no", { month: "long" }).format(
    new Date(date),
  );

  return capitalizeSetning(måned) ?? "";
}
