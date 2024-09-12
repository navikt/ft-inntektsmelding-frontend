export const enkeltGrunnlagResponse = {
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
  forespørselUuid: "1",
};
