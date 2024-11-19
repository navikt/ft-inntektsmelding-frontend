import { z } from "zod";

import { NaturalytelseTypeSchema } from "~/types/api-models";
import { beløpSchema, logDev } from "~/utils";

import { RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema } from "../RefusjonOmsorgspengerArbeidsgiverForm";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

export async function sendSøknad(sendSøknadRequest: unknown) {
  const parsedSendSøknadRequest =
    SendSøknadRequestDtoSchema.safeParse(sendSøknadRequest);

  if (!parsedSendSøknadRequest.success) {
    throw new SendSøknadError(SendSøknadFeilmelding.UGYLDIG_SØKNAD);
  }

  const response = await fetch(
    `${SERVER_URL}/refusjon-omsorgspenger-arbeidsgiver/send-soknad`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsedSendSøknadRequest.data),
    },
  );

  if (!response.ok) {
    throw new SendSøknadError(SendSøknadFeilmelding.GENERISK_FEIL);
  }

  const json = await response.json();
  const parsedJson = SendSøknadResponseDtoSchema.safeParse(json);

  if (!parsedJson.success) {
    logDev("error", parsedJson.error);

    throw new SendSøknadError(SendSøknadFeilmelding.GENERISK_FEIL);
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

const SendSøknadResponseDtoSchema = z.object({});

export class SendSøknadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SendSøknadError";
  }
}

export const SendSøknadFeilmelding = {
  GENERISK_FEIL:
    "Noe gikk galt under innsending av søknaden. Prøv igjen om litt.",
  UGYLDIG_SØKNAD: "Søknaden er ikke fylt inn riktig...",
} as const;
