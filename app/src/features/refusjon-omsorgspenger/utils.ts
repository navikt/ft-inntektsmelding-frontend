import { isDateWithinRange } from "~/utils/date-utils";

import { RefusjonOmsorgspengerArbeidsgiverSkjemaState } from "./RefusjonOmsorgspengerArbeidsgiverForm";

type FraværPeriodeArray =
  RefusjonOmsorgspengerArbeidsgiverSkjemaState["fraværHeleDager"];
type FraværDelerAvDagenArray =
  RefusjonOmsorgspengerArbeidsgiverSkjemaState["fraværDelerAvDagen"];

/**
 * Checks if any of the full day absence periods overlap with the given date range
 * @param fraværHeleDager Array of absence periods to check
 * @param startDate Start of the range to check against
 * @param endDate End of the range to check against
 * @returns boolean indicating if any absence period overlaps with the range
 */
export function hasFullDayAbsenceInRange(
  fraværHeleDager: FraværPeriodeArray,
  startDate: string,
  endDate: string,
) {
  return fraværHeleDager?.some((fravær) => {
    return (
      (fravær.fom &&
        isDateWithinRange(
          new Date(fravær.fom),
          new Date(startDate),
          new Date(endDate),
        )) ||
      (fravær.tom &&
        isDateWithinRange(
          new Date(fravær.tom),
          new Date(startDate),
          new Date(endDate),
        ))
    );
  });
}

/**
 * Checks if any of the partial day absence periods overlap with the given date range
 * @param fraværDelerAvDagen Array of partial day absence periods to check
 * @param startDate Start of the range to check against
 * @param endDate End of the range to check against
 * @returns boolean indicating if any partial absence period overlaps with the range
 */
export function hasPartialDayAbsenceInRange(
  fraværDelerAvDagen: FraværDelerAvDagenArray,
  startDate: string,
  endDate: string,
) {
  return fraværDelerAvDagen?.some((fravær) => {
    if (!fravær?.dato) {
      return false;
    }
    return isDateWithinRange(
      new Date(fravær.dato),
      new Date(startDate),
      new Date(endDate),
    );
  });
}

export function hasAbsenceInDateRange(
  fraværHeleDager: FraværPeriodeArray = [],
  fraværDelerAvDagen: FraværDelerAvDagenArray = [],
  startDate: string,
  endDate: string,
) {
  return (
    (fraværHeleDager?.length > 0 &&
      hasFullDayAbsenceInRange(fraværHeleDager, startDate, endDate)) ||
    (fraværDelerAvDagen?.length > 0 &&
      hasPartialDayAbsenceInRange(fraværDelerAvDagen, startDate, endDate))
  );
}
