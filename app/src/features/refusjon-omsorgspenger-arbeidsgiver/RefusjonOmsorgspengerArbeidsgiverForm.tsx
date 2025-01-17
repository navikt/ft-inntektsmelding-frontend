import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { NaturalytelseTypeSchema } from "~/types/api-models";
import { beløpSchema, lagFulltNavn } from "~/utils";

import { useOpplysninger } from "./useOpplysninger";

export const RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema = z.object({
  kontaktperson: z
    .object({
      navn: z.string(),
      telefonnummer: z.string(),
    })
    .optional(),
  årForRefusjon: z.string().optional(),
  harUtbetaltLønn: z.string().optional(),
  ansattesFødselsnummer: z.string().optional(),
  valgtArbeidsforhold: z.string().optional(),
  harDekket10FørsteOmsorgsdager: z.string().optional(),
  fraværHeleDager: z
    .array(
      z.object({
        fom: z.string().optional(),
        tom: z.string().optional(),
      }),
    )
    .optional(),
  fraværDelerAvDagen: z
    .array(
      z.object({
        dato: z.string().optional(),
        normalArbeidstid: z.number().optional(),
        timerFravær: z.number().optional(),
      }),
    )
    .optional(),
  inntekt: beløpSchema.optional(),
  inntektEndringsÅrsak: z
    .object({
      årsak: z.string().optional(),
      korrigertInntekt: beløpSchema,
      fom: z.string().optional(),
      tom: z.string().optional(),
    })
    .optional(),
  skalRefunderes: z.boolean().optional(),
  refusjonsbeløpPerMåned: beløpSchema.optional(),
  endringIRefusjon: z.boolean().optional(),
  refusjonsendringer: z
    .array(
      z.object({
        fom: z.string().optional(),
        beløp: beløpSchema,
      }),
    )
    .optional(),
  misterNaturalytelser: z.boolean().optional(),
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

export type RefusjonOmsorgspengerArbeidsgiverSkjemaState = z.infer<
  typeof RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema
>;

type Props = {
  children: React.ReactNode;
};
export const RefusjonOmsorgspengerArbeidsgiverForm = ({ children }: Props) => {
  const opplysninger = useOpplysninger();
  const formArgs = useForm<RefusjonOmsorgspengerArbeidsgiverSkjemaState>({
    defaultValues: {
      kontaktperson: {
        navn: lagFulltNavn(opplysninger),
        telefonnummer: opplysninger.telefon,
      },
    },
  });
  return <FormProvider {...formArgs}>{children}</FormProvider>;
};

export const useRefusjonOmsorgspengerArbeidsgiverFormContext = () => {
  return useFormContext<RefusjonOmsorgspengerArbeidsgiverSkjemaState>();
};
