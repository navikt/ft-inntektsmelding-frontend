import { RefusjonOmsorgspengerArbeidsgiverSkjemaState } from "./RefusjonOmsorgspengerArbeidsgiverForm";

export const mapSkjemaTilSendInntektsmeldingRequest = (
  skjemaState: RefusjonOmsorgspengerArbeidsgiverSkjemaState,
) => {
  const startdato = `${skjemaState.årForRefusjon}-01-01`;
  const inntekt = skjemaState.korrigertInntekt || skjemaState.inntekt;
  return {
    ...skjemaState,
    inntekt: inntekt,
    startdato: startdato,
    ytelse: "OMSORGSPENGER",
    aktorId: skjemaState.ansattesAktørId,
    arbeidsgiverIdent: skjemaState.organisasjonsnummer,
    refusjon: [
      {
        fom: startdato,
        beløp: inntekt,
      },
    ],
  };
};

const data = {
  kontaktperson: {
    navn: "Klar Jordbær",
    telefonnummer: "3",
  },
  harUtbetaltLønn: "ja",
  årForRefusjon: "2025",
  ansattesFødselsnummer: "28869097804",
  ansattesFornavn: "MOTIVERT",
  ansattesEtternavn: "HAUK",
  ansattesAktørId: "2277843203541",
  organisasjonsnummer: "315786940",
  harDekket10FørsteOmsorgsdager: "ja",
  fraværHeleDager: [
    {
      fom: "2025-01-06",
      tom: "2025-01-07",
    },
  ],
  fraværDelerAvDagen: [
    {
      normalArbeidstid: "7.5",
      timerFravær: "7.2",
      dato: "2025-02-01",
    },
  ],
  korrigertInntekt: "60000",
  endringAvInntektÅrsaker: [
    {
      fom: "2025-01-01",
      ignorerTom: false,
      årsak: "VARIG_LØNNSENDRING",
    },
  ],
  bortfaltNaturalytelsePerioder: [],
};
import { isDateWithinRange } from "~/utils/date-utils";

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
