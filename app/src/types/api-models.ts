import { z } from "zod";

export type MånedsinntektResponsDto = {
  fom: string;
  tom: string;
  beløp: number;
  arbeidsgiverIdent: string;
};

export const YtelsetypeSchema = z.enum([
  "FORELDREPENGER",
  "SVANGERSKAPSPENGER",
  "PLEIEPENGER_SYKT_BARN",
  "PLEIEPENGER_I_LIVETS_SLUTTFASE",
  "OPPLÆRINGSPENGER",
  "OMSORGSPENGER",
]);
export type Ytelsetype = z.infer<typeof YtelsetypeSchema>;

export const NaturalytelseTypeSchema = z.enum([
  "ELEKTRISK_KOMMUNIKASJON",
  "AKSJER_GRUNNFONDSBEVIS_TIL_UNDERKURS",
  "LOSJI",
  "KOST_DØGN",
  "BESØKSREISER_HJEMMET_ANNET",
  "KOSTBESPARELSE_I_HJEMMET",
  "RENTEFORDEL_LÅN",
  "BIL",
  "KOST_DAGER",
  "BOLIG",
  "SKATTEPLIKTIG_DEL_FORSIKRINGER",
  "FRI_TRANSPORT",
  "OPSJONER",
  "TILSKUDD_BARNEHAGEPLASS",
  "ANNET",
  "BEDRIFTSBARNEHAGEPLASS",
  "YRKEBIL_TJENESTLIGBEHOV_KILOMETER",
  "YRKEBIL_TJENESTLIGBEHOV_LISTEPRIS",
  "INNBETALING_TIL_UTENLANDSK_PENSJONSORDNING",
]);

export type Naturalytelsetype = z.infer<typeof NaturalytelseTypeSchema>;

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

export const ÅrsaksTypeSchema = z.enum(["Tariffendring", "FeilInntekt"]);

export type ÅrsaksType = z.infer<typeof ÅrsaksTypeSchema>;

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
  fom: string;
  tom?: string;
  beløp: number;
  naturalytelsetype: Naturalytelsetype;
};
