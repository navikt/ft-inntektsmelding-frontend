import { OpplysningerDto } from "~/types/api-models.ts";

const STANDARD_OPPLYSNINGER = {
  person: {
    fornavn: "UNDERFUNDIG",
    etternavn: "DYREFLOKK",
    fødselsnummer: "27527827812",
    aktørId: "2715347149890",
  },
  arbeidsgiver: {
    organisasjonNavn: "Papir- og pappvareproduksjon el.",
    organisasjonNummer: "810007842",
  },
  innsender: {
    fornavn: "BERØMT",
    etternavn: "FLYTTELASS",
  },
  forespørselStatus: "UNDER_BEHANDLING" as const,
  inntektsopplysninger: {
    gjennomsnittlønn: 53_000,
    månedsinntekter: [
      {
        fom: "2024-02-01",
        tom: "2024-02-29",
        beløp: 52_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-03-01",
        tom: "2024-03-31",
        beløp: 50_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-04-01",
        tom: "2024-04-30",
        beløp: 57_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
    ],
  },
  startdatoPermisjon: "2024-05-30",
  ytelse: "FORELDREPENGER" as const,
} satisfies OpplysningerDto;

export const enkeltOpplysningerResponse = STANDARD_OPPLYSNINGER;

export const utgåttOpplysningerResponse = {
  ...STANDARD_OPPLYSNINGER,
  forespørselStatus: "UTGÅTT" as const,
} satisfies OpplysningerDto;

export const opplysningerMedSisteMånedIkkeRapportertFørRapporteringsfrist = {
  ...STANDARD_OPPLYSNINGER,
  inntektsopplysninger: {
    gjennomsnittlønn: 51_666.67,
    månedsinntekter: [
      {
        fom: "2024-01-01",
        tom: "2024-01-29",
        beløp: 53_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-02-01",
        tom: "2024-02-29",
        beløp: 52_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-03-01",
        tom: "2024-03-31",
        beløp: 50_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-04-01",
        tom: "2024-04-30",
        status: "IKKE_RAPPORTERT_RAPPORTERINGSFRIST_IKKE_PASSERT",
      },
    ],
  },
} satisfies OpplysningerDto;

export const opplysningerMedSisteMånedRapportert0 = {
  ...STANDARD_OPPLYSNINGER,
  inntektsopplysninger: {
    gjennomsnittlønn: 34_000,
    månedsinntekter: [
      {
        fom: "2024-02-01",
        tom: "2024-02-29",
        beløp: 52_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-03-01",
        tom: "2024-03-31",
        beløp: 50_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-04-01",
        tom: "2024-04-30",
        status: "IKKE_RAPPORTERT_MEN_BRUKT_I_GJENNOMSNITT",
      },
    ],
  },
} satisfies OpplysningerDto;

export const opplysningerMedFlereEnn3Måneder = {
  ...STANDARD_OPPLYSNINGER,
  startdatoPermisjon: "2024-05-04",
  inntektsopplysninger: {
    gjennomsnittlønn: 52_000,
    månedsinntekter: [
      {
        fom: "2023-12-01",
        tom: "2023-12-31",
        beløp: 52_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-01-01",
        tom: "2024-01-29",
        beløp: 52_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-02-01",
        tom: "2024-02-29",
        beløp: 52_000,
        status: "BRUKT_I_GJENNOMSNITT",
      },
      {
        fom: "2024-03-01",
        tom: "2024-03-31",
        status: "IKKE_RAPPORTERT_RAPPORTERINGSFRIST_IKKE_PASSERT",
      },
      {
        fom: "2024-04-01",
        tom: "2024-04-30",
        status: "IKKE_RAPPORTERT_RAPPORTERINGSFRIST_IKKE_PASSERT",
      },
    ],
  },
} satisfies OpplysningerDto;

export const fullførtOppgaveResponse = {
  ...STANDARD_OPPLYSNINGER,
  forespørselStatus: "FERDIG" as const,
} satisfies OpplysningerDto;
