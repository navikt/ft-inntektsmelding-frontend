export type MånedsinntektResponsDto = {
  fom: string;
  tom: string;
  beløp: number;
  arbeidsgiverIdent: string;
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
  kontaktperson: KontaktpersonDto;
  startdato: string;
  inntekt: number;
  inntektEndringsÅrsak?: InntektEndretÅrsakDto;
  refusjonsperioder: RefusjonsperiodeRequestDto[];
  bortfaltNaturaltytelsePerioder: NaturalytelseRequestDto[];
};

export type ÅrsaksType = "Tariffendring" | "FeilInntekt";

type InntektEndretÅrsakDto = {
  årsak: ÅrsaksType;
  fom?: string;
  tom?: string;
};

type KontaktpersonDto = {
  telefonnummer: string;
  navn: string;
};

export type RefusjonsperiodeRequestDto = {
  fom: string;
  tom?: string;
  beløp: number;
};

export type NaturalytelseRequestDto = {
  fom: string; // TODO: omdøp i BE til "fraOgMed"
  tom?: string;
  beløp: number;
  naturalytelsetype: Naturalytelsetype;
  erBortfalt: boolean;
};
