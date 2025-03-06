import { isDateWithinRange } from "~/utils/date-utils";

import { RefusjonOmsorgspengerDto } from "./api/mutations";
import { RefusjonOmsorgspengerFormData } from "./RefusjonOmsorgspengerArbeidsgiverForm";

const mapJaNeiTilBoolean = (value: "ja" | "nei") => {
  if (value === "ja") {
    return true;
  }
  return false;
};

export const mapSkjemaTilSendInntektsmeldingRequest = (
  skjemaState: RefusjonOmsorgspengerFormData,
): RefusjonOmsorgspengerDto => {
  const validatedSkjemaState = skjemaState as RefusjonOmsorgspengerFormData & {
    endringAvInntektÅrsaker: RefusjonOmsorgspengerDto["endringAvInntektÅrsaker"];
  };

  const startdato = `${validatedSkjemaState.årForRefusjon}-01-01`;
  const inntekt =
    validatedSkjemaState.korrigertInntekt || validatedSkjemaState.inntekt;
  return {
    kontaktperson: {
      navn: validatedSkjemaState.kontaktperson.navn,
      telefonnummer: validatedSkjemaState.kontaktperson.telefonnummer,
    },
    inntekt: inntekt as number,
    startdato: startdato,
    ytelse: "OMSORGSPENGER",
    aktorId: validatedSkjemaState.ansattesAktørId as string,
    arbeidsgiverIdent: validatedSkjemaState.organisasjonsnummer as string,
    refusjon: [
      {
        fom: startdato,
        beløp: inntekt as number,
      },
    ],
    omsorgspenger: {
      harUtbetaltPliktigeDager: mapJaNeiTilBoolean(
        validatedSkjemaState.harDekket10FørsteOmsorgsdager as "ja" | "nei",
      ),
      fraværHeleDager: validatedSkjemaState.fraværHeleDager,
      fraværDelerAvDagen: validatedSkjemaState.fraværDelerAvDagen,
    },
    bortfaltNaturalytelsePerioder: [],
    endringAvInntektÅrsaker: validatedSkjemaState.korrigertInntekt
      ? validatedSkjemaState.endringAvInntektÅrsaker
      : [],
  };
};

type FraværPeriodeArray = RefusjonOmsorgspengerFormData["fraværHeleDager"];
type FraværDelerAvDagenArray =
  RefusjonOmsorgspengerFormData["fraværDelerAvDagen"];

/**
 * Checks if any of the full day absence periods overlap with the given date range
 * @param fraværHeleDager Array of absence periods to check
 * @param startDate Start of the range to check against
 * @param endDate End of the range to check against
 * @returns boolean indicating if any absence period overlaps with the range
 */
export function hasFullDayAbsenceInRange(
  fraværHeleDager: FraværPeriodeArray,
  startDate: Date,
  endDate: Date,
) {
  return fraværHeleDager?.some((fravær) => {
    return (
      (fravær.fom &&
        isDateWithinRange(new Date(fravær.fom), startDate, endDate)) ||
      (fravær.tom &&
        isDateWithinRange(new Date(fravær.tom), startDate, endDate))
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
  startDate: Date,
  endDate: Date,
) {
  return fraværDelerAvDagen?.some((fravær) => {
    if (!fravær?.dato) {
      return false;
    }
    return isDateWithinRange(new Date(fravær.dato), startDate, endDate);
  });
}

export function hasAbsenceInDateRange(
  fraværHeleDager: FraværPeriodeArray = [],
  fraværDelerAvDagen: FraværDelerAvDagenArray = [],
  startDate: Date,
  endDate: Date,
) {
  return (
    (fraværHeleDager?.length > 0 &&
      hasFullDayAbsenceInRange(fraværHeleDager, startDate, endDate)) ||
    (fraværDelerAvDagen?.length > 0 &&
      hasPartialDayAbsenceInRange(fraværDelerAvDagen, startDate, endDate))
  );
}

export function beregnGyldigDatoIntervall(årForRefusjon: number) {
  const iDag = new Date();

  if (årForRefusjon === iDag.getFullYear()) {
    return { minDato: new Date(iDag.getFullYear(), 0, 1), maxDato: iDag };
  }
  const førsteDagAvIfjor = new Date(new Date().getFullYear() - 1, 0, 1);
  const sisteDagAvIfjor = new Date(new Date().getFullYear() - 1, 11, 31);

  return { minDato: førsteDagAvIfjor, maxDato: sisteDagAvIfjor };
}

export function utledDefaultMonthDatepicker(årForRefusjon: number) {
  const iDag = new Date();
  if (årForRefusjon === iDag.getFullYear()) {
    return iDag;
  }
  return new Date(`${årForRefusjon}-12-31`);
}
