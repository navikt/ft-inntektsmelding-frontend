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
