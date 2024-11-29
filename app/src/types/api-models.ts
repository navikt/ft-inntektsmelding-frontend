import { z } from "zod";

import { formatNavn } from "~/utils.ts";

export const YtelsetypeSchema = z.enum([
  "FORELDREPENGER",
  "SVANGERSKAPSPENGER",
  "PLEIEPENGER_SYKT_BARN",
  "PLEIEPENGER_NÆRSTÅENDE",
  "OPPLÆRINGSPENGER",
  "OMSORGSPENGER",
]);

export const NaturalytelseTypeSchema = z.enum([
  "ELEKTRISK_KOMMUNIKASJON",
  "AKSJER_GRUNNFONDSBEVIS_TIL_UNDERKURS",
  "LOSJI",
  "KOST_DOEGN",
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

export const EndringAvInntektÅrsakerSchema = z.enum([
  "PERMITTERING",
  "NY_STILLING",
  "NY_STILLINGSPROSENT",
  "SYKEFRAVÆR",
  "BONUS",
  "FERIETREKK_ELLER_UTBETALING_AV_FERIEPENGER",
  "NYANSATT",
  "MANGELFULL_RAPPORTERING_AORDNING",
  "FEIL_RAPPORTERING_AORDNING",
  "TARIFFENDRING",
  "FERIE",
  "VARIG_LØNNSENDRING",
  "PERMISJON",
]);

export type EndringAvInntektÅrsaker = z.infer<
  typeof EndringAvInntektÅrsakerSchema
>;
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
  refusjon: z
    .array(
      z.object({
        fom: z.string().optional(),
        beløp: z.number(),
      }),
    )
    .optional(),
  endringAvInntektÅrsaker: z
    .array(
      z.object({
        årsak: EndringAvInntektÅrsakerSchema,
        fom: z.string().optional(),
        tom: z.string().optional(),
        bleKjentFom: z.string().optional(),
      }),
    )
    .optional(), //TODO: midlertidig optional
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

export const opplysningerSchema = z.object({
  person: z.object({
    aktørId: z.string(),
    fødselsnummer: z.string(),
    fornavn: z.string().transform(formatNavn),
    mellomnavn: z
      .string()
      .transform((mellomnavn) => formatNavn(mellomnavn || ""))
      .optional(),
    etternavn: z.string().transform(formatNavn),
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
  inntektsopplysninger: z.object({
    gjennomsnittLønn: z.number().optional(),
    månedsinntekter: z.array(
      z.object({
        fom: z.string(),
        tom: z.string(),
        beløp: z.number().optional(),
        status: z.enum([
          "NEDETID_AINNTEKT",
          "BRUKT_I_GJENNOMSNITT",
          "IKKE_RAPPORTERT_MEN_BRUKT_I_GJENNOMSNITT",
          "IKKE_RAPPORTERT_RAPPORTERINGSFRIST_IKKE_PASSERT",
        ]),
      }),
    ),
  }),
  forespørselStatus: z.enum(["UNDER_BEHANDLING", "FERDIG", "UTGÅTT"]),
  skjæringstidspunkt: z.string(),
  førsteUttaksdato: z.string(),
  ytelse: z.enum([
    "FORELDREPENGER",
    "SVANGERSKAPSPENGER",
    "PLEIEPENGER_SYKT_BARN",
    "PLEIEPENGER_NÆRSTÅENDE",
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
