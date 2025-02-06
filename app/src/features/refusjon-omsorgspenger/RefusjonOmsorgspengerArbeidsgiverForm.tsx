import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import {
  EndringAvInntektÅrsakerSchema,
  NaturalytelseTypeSchema,
} from "~/types/api-models";
import { beløpSchema, lagFulltNavn } from "~/utils";

import { useInnloggetBruker } from "./useInnloggetBruker";

export const RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema = z.object({
  kontaktperson: z
    .object({
      navn: z.string(),
      telefonnummer: z.string(),
    })
    .optional(),
  ansattesFødselsnummer: z.string().optional(),
  ansattesFornavn: z.string().optional(),
  ansattesEtternavn: z.string().optional(),
  ansattesAktørId: z.string().optional(),
  årForRefusjon: z.string().optional(),
  harUtbetaltLønn: z.string().optional(),
  organisasjonsnummer: z.string(),
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
  inntekt: beløpSchema,
  korrigertInntekt: beløpSchema.optional(),
  endringAvInntektÅrsaker: z.array(
    z.object({
      årsak: z.union([EndringAvInntektÅrsakerSchema, z.literal("")]),
      fom: z.string().optional(),
      tom: z.string().optional(),
      bleKjentFom: z.string().optional(),
    }),
  ),
  skalRefunderes: z
    .union([
      z.literal("JA_LIK_REFUSJON"),
      z.literal("JA_VARIERENDE_REFUSJON"),
      z.literal("NEI"),
    ])
    .optional(),
  refusjon: z.array(
    z.object({
      fom: z.string().optional(),
      beløp: beløpSchema,
    }),
  ),
  misterNaturalytelser: z.boolean().optional(),
  bortfaltNaturalytelsePerioder: z.array(
    z.object({
      navn: z.union([NaturalytelseTypeSchema, z.literal("")]),
      beløp: beløpSchema,
      fom: z.string().optional(),
      tom: z.string().optional(),
      inkluderTom: z.boolean(),
    }),
  ),
});

export type RefusjonOmsorgspengerArbeidsgiverSkjemaState = z.infer<
  typeof RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema
>;

type Props = {
  children: React.ReactNode;
};
export const RefusjonOmsorgspengerArbeidsgiverForm = ({ children }: Props) => {
  const opplysninger = useInnloggetBruker();
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
