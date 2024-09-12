export const enkeltGrunnlagResponse = {
  person: {
    aktørId: "1234567890123",
    fødselsnummer: "12345678901",
    fornavn: "Ola",
    mellomnavn: "Normann",
    etternavn: "Hansen",
  },
  innsender: {
    fornavn: "Kari",
    mellomnavn: "Normann",
    etternavn: "Hansen",
    telefon: "12345678",
  },
  arbeidsgiver: {
    organisasjonNavn: "Bedrift AS",
    organisasjonNummer: "123456789",
  },
  inntekter: [
    {
      fom: "2023-01-01",
      tom: "2023-12-31",
      beløp: 500_000,
      arbeidsgiverIdent: "123456789",
    },
    {
      fom: "2022-01-01",
      tom: "2022-12-31",
      beløp: 480_000,
      arbeidsgiverIdent: "123456789",
    },
  ],
  startdatoPermisjon: "2024-03-01",
  ytelse: "FORELDREPENGER" as const,
};
