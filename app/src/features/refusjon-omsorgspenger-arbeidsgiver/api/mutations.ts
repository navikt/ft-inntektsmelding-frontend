import { z } from "zod";

import { NaturalytelseTypeSchema } from "~/types/api-models";
import { beløpSchema, logDev } from "~/utils";

import { RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema } from "../RefusjonOmsorgspengerArbeidsgiverForm";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

export async function sendSøknad(sendSøknadRequest: SendSøknadRequestDto) {
  const response = await fetch(
    `${SERVER_URL}/refusjon-omsorgspenger-arbeidsgiver/send-soknad`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendSøknadRequest),
    },
  );

  if (!response.ok) {
    throw new Error("Noe gikk galt.");
  }

  const json = await response.json();
  const parsedJson = SendSøknadResponseDtoSchema.safeParse(json);

  if (!parsedJson.success) {
    logDev("error", parsedJson.error);

    throw new Error("Responsen fra serveren matchet ikke forventet format");
  }
  return parsedJson.data;
}

export const SendSøknadRequestDtoSchema =
  RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema.required()
    .partial()
    .required()
    .extend({
      valgtArbeidsforhold: z.string().optional(),
      inntektEndringsÅrsak: z
        .object({
          årsak: z.string(),
          korrigertInntekt: beløpSchema,
          fom: z.string().optional(),
          tom: z.string().optional(),
        })
        .optional(),
      refusjonsendringer: z
        .array(
          z.object({
            fom: z.string().optional(),
            beløp: beløpSchema,
          }),
        )
        .optional(),
      bortfaltNaturalytelsePerioder: z
        .array(
          z.object({
            navn: z.union([NaturalytelseTypeSchema, z.literal("")]),
            beløp: beløpSchema,
            fom: z.string().optional(),
            tom: z.string().optional(),
            inkluderTom: z.boolean(),
          }),
        )
        .optional(),
    });
type SendSøknadRequestDto = z.infer<typeof SendSøknadRequestDtoSchema>;

const SendSøknadResponseDtoSchema = z.object({});
