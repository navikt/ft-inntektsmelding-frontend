import { z } from "zod";

import { beløpSchema } from "~/utils.ts";

const kontaktpersonSchema = z.object({
  navn: z.string(),
  telefonnummer: z.string(),
});

const skalRefunderesSchema = z.union([
  z.literal("JA_LIK_REFUSJON"),
  z.literal("JA_VARIERENDE_REFUSJON"),
  z.literal("NEI"),
]);

// Før vi er i oppsummeringssteget
export const InntektsmeldingSkjemaStateSchema = z.object({
  kontaktperson: kontaktpersonSchema,
  refusjon: z.array(
    z
      .object({
        fom: z.string().optional(),
        beløp: beløpSchema.optional(),
      })
      .optional(),
  ),
  skalRefunderes: skalRefunderesSchema.optional(),
  førsteFraværsdag: z.string().optional(),
  id: z.number().optional(),
  opprettetTidspunkt: z.string().optional(),
});

// Klar for innsending til backend. Når vi er i oppsummeringssteget, eller tidligere innsendt skjema.
export const AGIValidatedInntektsmelding = z.object({
  kontaktperson: kontaktpersonSchema,
  refusjon: z.array(
    z.object({
      fom: z.string(),
      beløp: beløpSchema,
    }),
  ),
  skalRefunderes: skalRefunderesSchema,
  førsteFraværsdag: z.string(),
  id: z.number().optional(),
  opprettetTidspunkt: z.string().optional(),
});

export type InntektsmeldingSkjemaStateAGI = z.infer<
  typeof InntektsmeldingSkjemaStateSchema
>;

export type InntektsmeldingSkjemaStateValidAGI = z.infer<
  typeof AGIValidatedInntektsmelding
>;
