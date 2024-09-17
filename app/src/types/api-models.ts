import { z } from "zod";

import { beløpSchema, navnMedStorBokstav } from "~/utils.ts";

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
  inntekt: beløpSchema,
  refusjon: beløpSchema.optional(),
  refusjonsendringer: z
    .array(
      z.object({
        fom: z.string(),
        beløp: beløpSchema,
      }),
    )
    .optional(),
  bortfaltNaturalytelsePerioder: z
    .array(
      z.object({
        fom: z.string(),
        tom: z.string().optional(),
        beløp: beløpSchema,
        naturalytelsetype: NaturalytelseTypeSchema,
      }),
    )
    .optional(), // TODO: Når databasen er wipet, kan vi fjerne optional her.
});

export const InntektsmeldingResponseDtoSchema =
  SendInntektsmeldingRequestDtoSchema.extend({
    opprettetTidspunkt: z.string(),
    id: z.number(),
  });

export type SendInntektsmeldingResponseDto = z.infer<
  typeof InntektsmeldingResponseDtoSchema
>;

export type SendInntektsmeldingRequestDto = z.infer<
  typeof SendInntektsmeldingRequestDtoSchema
>;

export const ÅrsaksTypeSchema = z.enum(["Tariffendring", "FeilInntekt"]);

export type ÅrsaksType = z.infer<typeof ÅrsaksTypeSchema>;

export const opplysningerSchema = z.object({
  person: z.object({
    aktørId: z.string(),
    fødselsnummer: z.string(),
    fornavn: z.string().transform(navnMedStorBokstav),
    mellomnavn: z
      .string()
      .transform((mellomnavn) => navnMedStorBokstav(mellomnavn || ""))
      .optional(),
    etternavn: z.string().transform(navnMedStorBokstav),
  }),
  innsender: z.object({
    fornavn: z.string(),
    mellomnavn: z.string().optional(),
    etternavn: z.string(),
    telefon: z.string().optional(),
  }),
  arbeidsgiver: z.object({
    organisasjonNavn: z.string(),
    organisasjonNummer: z.string(),
  }),
  inntekter: z.array(
    z.object({
      fom: z.string(),
      tom: z.string(),
      beløp: z.number().optional(),
      arbeidsgiverIdent: z.string(),
    }),
  ),
  startdatoPermisjon: z.string(),
  ytelse: z.enum([
    "FORELDREPENGER",
    "SVANGERSKAPSPENGER",
    "PLEIEPENGER_SYKT_BARN",
    "PLEIEPENGER_I_LIVETS_SLUTTFASE",
    "OPPLÆRINGSPENGER",
    "OMSORGSPENGER",
  ]),
});

export type OpplysningerDto = z.infer<typeof opplysningerSchema>;

export const grunnbeløpSchema = z.object({
  dato: z.string(),
  grunnbeløp: z.number(),
  grunnbeløpPerMåned: z.number(),
  gjennomsnittPerÅr: z.number(),
  omregningsfaktor: z.number(),
  virkningstidspunktForMinsteinntekt: z.string(),
});
