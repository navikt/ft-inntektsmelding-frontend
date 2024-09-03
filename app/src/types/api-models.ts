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
  refusjon?: number;
  refusjonsendringer: RefusjonsendringRequestDto[];
  bortfaltNaturalytelsePerioder: NaturalytelseRequestDto[];
};

export type ÅrsaksType = "Tariffendring" | "FeilInntekt";

// @ts-expect-error -- Taes i bruk senere når backend støtter endretårsak
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type InntektEndretÅrsakDto = {
  korrigertInntekt: number;
  årsak: ÅrsaksType;
  fom?: string;
  tom?: string;
};

type KontaktpersonDto = {
  telefonnummer: string;
  navn: string;
};

export type RefusjonsendringRequestDto = {
  fom: string;
  beløp: number;
};

export type NaturalytelseRequestDto = {
  fom: string; // TODO: omdøp i BE til "fraOgMed"
  tom?: string;
  beløp: number;
  naturalytelsetype: Naturalytelsetype;
};
