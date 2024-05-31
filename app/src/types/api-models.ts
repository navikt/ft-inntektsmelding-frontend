export type PersonInfoDto = {
  aktørId: string;
  fødselsnummer: string;
  navn: string;
};

export type OrganisasjonInfoDto = {
  organisasjonNavn: string;
  organisasjonNummer: string;
};

export type MånedsinntektResponsDto = {
  fom: string;
  tom: string;
  beløp: number;
  organisasjonsnummer: string;
};

export type HentInntektRequestDto = {
  aktorId: string;
  ytelse: Ytelsetype;
  organisasjonsnummer: string;
  startdato: string;
};

export type Ytelsetype =
  | "FORELDREPENGER"
  | "SVANGERSKAPSPENGER"
  | "PLEIEPENGER_SYKT_BARN"
  | "PLEIEPENGER_I_LIVETS_SLUTTFASE"
  | "OPPLÆRINGSPENGER"
  | "OMSORGSPENGER";

export type Naturalytelsetype =
  | "ELEKTRISK_KOMMUNIKASJON"
  | "AKSJER_GRUNNFONDSBEVIS_TIL_UNDERKURS"
  | "LOSJI"
  | "KOST_DØGN"
  | "BESØKSREISER_HJEMMET_ANNET"
  | "KOSTBESPARELSE_I_HJEMMET"
  | "RENTEFORDEL_LÅN"
  | "BIL"
  | "KOST_DAGER"
  | "BOLIG"
  | "SKATTEPLIKTIG_DEL_FORSIKRINGER"
  | "FRI_TRANSPORT"
  | "OPSJONER"
  | "TILSKUDD_BARNEHAGEPLASS"
  | "ANNET"
  | "BEDRIFTSBARNEHAGEPLASS"
  | "YRKEBIL_TJENESTLIGBEHOV_KILOMETER"
  | "YRKEBIL_TJENESTLIGBEHOV_LISTEPRIS"
  | "INNBETALING_TIL_UTENLANDSK_PENSJONSORDNING";

export type SendInntektsmeldingRequestDto = {
  foresporselUuid: string;
  aktorId: string;
  ytelse: Ytelsetype;
  arbeidsgiverIdent: string;
  telefonnummer: string;
  startdato: string;
  inntekt: number;
  refusjonsperioder: RefusjonsperiodeRequestDto[];
  bortfaltNaturaltytelsePerioder: NaturalytelseRequestDto[];
};

type RefusjonsperiodeRequestDto = {
  fom: string;
  tom: string;
  beløp: number;
};

type NaturalytelseRequestDto = {
  fom: string;
  tom: string;
  beløp: number;
  naturalytelsetype: Naturalytelsetype;
};
