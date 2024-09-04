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

export const SendInntektsmeldingRequestDtoSchema = z.object({
  foresporselUuid: z.string(),
  aktorId: z.string(),
  ytelse: YtelsetypeSchema,
  arbeidsgiverIdent: z.string(),
  kontaktperson: z.object({
    telefonnummer: z.string(),
    navn: z.string(),
  }),
  startdato: z.string(),
  inntekt: z.number(),
  refusjon: z.number().optional(),
  refusjonsendringer: z
    .array(
      z.object({
        fom: z.string(),
        beløp: z.number(),
      }),
    )
    .optional(),
  bortfaltNaturalytelsePerioder: z
    .array(
      z.object({
        fom: z.string(),
        tom: z.string().optional(),
        beløp: z.number(),
        naturalytelsetype: NaturalytelseTypeSchema,
      }),
    )
    .optional(), // TODO: Når databasen er wipet, kan vi fjerne optional her.
});

export type SendInntektsmeldingRequestDto = z.infer<
  typeof SendInntektsmeldingRequestDtoSchema
>;

export const ÅrsaksTypeSchema = z.enum(["Tariffendring", "FeilInntekt"]);

export type ÅrsaksType = z.infer<typeof ÅrsaksTypeSchema>;
