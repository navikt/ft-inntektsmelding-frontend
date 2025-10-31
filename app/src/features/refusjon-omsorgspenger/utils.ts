import dayjs from "dayjs";

import { OpplysningerDto } from "~/types/api-models";
import {
  dagerTilPerioder,
  isDateWithinRange,
  periodeTilDager,
} from "~/utils/date-utils";

import {
  RefusjonOmsorgspengerDto,
  RefusjonOmsorgspengerResponseDto,
} from "./api/mutations";
import { RefusjonOmsorgspengerFormData } from "./zodSchemas";

const mapJaNeiTilBoolean = (value: "ja" | "nei") => {
  if (value === "ja") {
    return true;
  }
  return false;
};

export const refusjonForOmsorgspenger = (
  førsteFraværsdag: string,
  beløp:
    | RefusjonOmsorgspengerFormData["korrigertInntekt"]
    | RefusjonOmsorgspengerFormData["inntekt"],
) => {
  return [
    {
      fom: førsteFraværsdag,
      beløp: Number(String(beløp).replaceAll(",", ".")),
    },
  ];
};

export const utledFørsteFraværsdag = (
  fraværHeleDager: FraværPeriodeArray,
  fraværDelerAvDagen: FraværDelerAvDagenArray,
) => {
  const førsteFraværsdagHeleDager = fraværHeleDager.toSorted((a, b) => {
    return new Date(a.fom).getTime() - new Date(b.fom).getTime();
  })[0]?.fom;
  const førsteFraværsdagDelerAvDagen = fraværDelerAvDagen.toSorted((a, b) => {
    return new Date(a.dato).getTime() - new Date(b.dato).getTime();
  })[0]?.dato;

  if (førsteFraværsdagHeleDager && førsteFraværsdagDelerAvDagen) {
    return new Date(førsteFraværsdagHeleDager).getTime() <
      new Date(førsteFraværsdagDelerAvDagen).getTime()
      ? førsteFraværsdagHeleDager
      : førsteFraværsdagDelerAvDagen;
  }
  return førsteFraværsdagHeleDager || førsteFraværsdagDelerAvDagen;
};

export const mapSkjemaTilSendInntektsmeldingRequest = (
  skjemaState: RefusjonOmsorgspengerFormData,
): RefusjonOmsorgspengerDto => {
  const validatedSkjemaState = skjemaState as RefusjonOmsorgspengerFormData & {
    endringAvInntektÅrsaker: RefusjonOmsorgspengerDto["endringAvInntektÅrsaker"];
  };
  const trukketDager = validatedSkjemaState.dagerSomSkalTrekkes
    .flatMap((dager) => periodeTilDager(dager))
    .map((dag) => {
      return {
        dato: dayjs(dag).format("YYYY-MM-DD"),
        timer: "0",
      };
    });

  const fraværDelerAvDagen = [
    ...validatedSkjemaState.fraværDelerAvDagen,
    ...trukketDager,
  ];
  const førsteFraværsdag = dayjs(
    utledFørsteFraværsdag(
      validatedSkjemaState.fraværHeleDager,
      fraværDelerAvDagen,
    ),
  ).format("YYYY-MM-DD");
  const inntekt =
    validatedSkjemaState.korrigertInntekt || validatedSkjemaState.inntekt;
  return {
    kontaktperson: {
      navn: validatedSkjemaState.kontaktperson.navn,
      telefonnummer: validatedSkjemaState.kontaktperson.telefonnummer,
    },
    inntekt: Number(String(inntekt).replaceAll(",", ".")),
    startdato: førsteFraværsdag,
    ytelse: "OMSORGSPENGER",
    aktorId: validatedSkjemaState.ansattesAktørId as string,
    arbeidsgiverIdent: validatedSkjemaState.organisasjonsnummer as string,
    refusjon: refusjonForOmsorgspenger(førsteFraværsdag, inntekt),
    omsorgspenger: {
      harUtbetaltPliktigeDager: mapJaNeiTilBoolean(
        validatedSkjemaState.harDekket10FørsteOmsorgsdager as "ja" | "nei",
      ),
      fraværHeleDager: validatedSkjemaState.fraværHeleDager,
      fraværDelerAvDagen,
    },
    bortfaltNaturalytelsePerioder: [],
    endringAvInntektÅrsaker: validatedSkjemaState.korrigertInntekt
      ? validatedSkjemaState.endringAvInntektÅrsaker
      : [],
  };
};

export const mapSendInntektsmeldingTilSkjema = (
  opplysninger: OpplysningerDto,
  inntektsmelding: RefusjonOmsorgspengerResponseDto,
) => {
  const delvisFravær =
    inntektsmelding.omsorgspenger?.fraværDelerAvDagen?.filter(
      (dager) => Number(dager.timer) > 0,
    );

  const dagerSomSkalTrekkes = inntektsmelding.omsorgspenger?.fraværDelerAvDagen
    ?.filter((dager) => Number(dager.timer) === 0)
    .map((dager) => dager.dato);

  const dagerSomSkalTrekkesPerioder = dagerTilPerioder(dagerSomSkalTrekkes);

  return {
    meta: {
      step: 5,
      skalKorrigereInntekt: !!inntektsmelding.endringAvInntektÅrsaker?.length,
      innsendtSøknadId: inntektsmelding.id,
      startdato: inntektsmelding.startdato,
      opprettetTidspunkt: inntektsmelding.opprettetTidspunkt,
    },
    kontaktperson: {
      navn: inntektsmelding.kontaktperson.navn,
      telefonnummer: inntektsmelding.kontaktperson.telefonnummer,
    },
    fraværHeleDager: inntektsmelding.omsorgspenger.fraværHeleDager ?? [],
    fraværDelerAvDagen: delvisFravær ?? [],
    dagerSomSkalTrekkes: dagerSomSkalTrekkesPerioder ?? [],
    harDekket10FørsteOmsorgsdager: inntektsmelding.omsorgspenger
      .harUtbetaltPliktigeDager
      ? "ja"
      : "nei",
    korrigertInntekt: inntektsmelding.endringAvInntektÅrsaker?.length
      ? inntektsmelding.inntekt
      : undefined,
    inntekt: inntektsmelding.endringAvInntektÅrsaker?.length
      ? undefined
      : inntektsmelding.inntekt,
    endringAvInntektÅrsaker: inntektsmelding.endringAvInntektÅrsaker,
    organisasjonsnummer: inntektsmelding.arbeidsgiverIdent,
    ansattesAktørId: inntektsmelding.aktorId,
    ansattesFødselsnummer: opplysninger.person.fødselsnummer,
    ansattesFornavn: opplysninger.person.fornavn,
    ansattesEtternavn: opplysninger.person.etternavn,
    årForRefusjon: new Date(inntektsmelding.startdato).getFullYear().toString(),
    harUtbetaltLønn: "ja",
  } satisfies RefusjonOmsorgspengerFormData;
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
  const sisteDagAvIfjor = new Date(
    new Date().getFullYear() - 1,
    11,
    31,
    23,
    59,
    59,
  );
  return { minDato: førsteDagAvIfjor, maxDato: sisteDagAvIfjor };
}

export function utledDefaultMonthDatepicker(årForRefusjon: number) {
  const iDag = new Date();
  if (årForRefusjon === iDag.getFullYear()) {
    return iDag;
  }
  return new Date(`${årForRefusjon}-12-31`);
}

export function datoErInnenforGyldigDatoIntervall(dato: string, år: number) {
  const gyldigDatoIntervall = beregnGyldigDatoIntervall(år);
  const datoObjekt = new Date(dato);
  return (
    datoObjekt >= gyldigDatoIntervall.minDato &&
    datoObjekt <= gyldigDatoIntervall.maxDato
  );
}
