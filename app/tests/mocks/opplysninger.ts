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
  inntekter: [
    {
      fom: "2024-02-01",
      tom: "2024-02-29",
      beløp: 52_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-03-01",
      tom: "2024-03-31",
      beløp: 50_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-04-01",
      tom: "2024-04-30",
      beløp: 57_000,
      arbeidsgiverIdent: "810007842",
    },
  ],
  startdatoPermisjon: "2024-05-30",
  ytelse: "FORELDREPENGER" as const,
} satisfies OpplysningerDto;

export const enkeltOpplysningerResponse = STANDARD_OPPLYSNINGER;

export const utgåttOpplysningerResponse = {
  ...STANDARD_OPPLYSNINGER,
  forespørselStatus: "UTGÅTT" as const,
} satisfies OpplysningerDto;

export const opplysningerMedSisteMånedIkkeRapportert = {
  ...STANDARD_OPPLYSNINGER,
  inntekter: [
    {
      fom: "2024-02-01",
      tom: "2024-02-29",
      beløp: 52_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-03-01",
      tom: "2024-03-31",
      beløp: 50_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-04-01",
      tom: "2024-04-30",
      arbeidsgiverIdent: "810007842",
    },
  ],
} satisfies OpplysningerDto;

export const opplysningerMedSisteMånedRapportert0 = {
  ...STANDARD_OPPLYSNINGER,
  inntekter: [
    {
      fom: "2024-02-01",
      tom: "2024-02-29",
      beløp: 52_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-03-01",
      tom: "2024-03-31",
      beløp: 50_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-04-01",
      tom: "2024-04-30",
      beløp: 0,
      arbeidsgiverIdent: "810007842",
    },
  ],
} satisfies OpplysningerDto;

export const opplysningerMedFlereEnn3Måneder = {
  ...STANDARD_OPPLYSNINGER,
  inntekter: [
    {
      fom: "2024-01-01",
      tom: "2024-01-29",
      beløp: 51_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-02-01",
      tom: "2024-02-29",
      beløp: 52_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-03-01",
      tom: "2024-03-31",
      beløp: 50_000,
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-04-01",
      tom: "2024-04-30",
      arbeidsgiverIdent: "810007842",
    },
  ],
} satisfies OpplysningerDto;

export const fullførtOppgaveResponse = {
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
  forespørselStatus: "FERDIG" as const,
  inntekter: [
    {
      fom: "2024-02-01",
      tom: "2024-02-29",
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-03-01",
      tom: "2024-03-31",
      arbeidsgiverIdent: "810007842",
    },
    {
      fom: "2024-04-01",
      tom: "2024-04-30",
      arbeidsgiverIdent: "810007842",
    },
  ],
  startdatoPermisjon: "2024-05-30",
  ytelse: "FORELDREPENGER" as const,
} satisfies OpplysningerDto;
