import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import {
  EndringAvInntektÅrsakerSchema,
  NaturalytelseTypeSchema,
} from "~/types/api-models";
import { beløpSchema, lagFulltNavn } from "~/utils";

import { useInnloggetBruker } from "./useInnloggetBruker";

// Step 1: Refusjon (Intro)
// her har vi en preprocess fordi feltene er radio knapper og blir null når ingen radios er checked
export const Steg1RefusjonSchema = z.object({
  harUtbetaltLønn: z.preprocess(
    (val) => val || "",
    z.string().min(1, {
      message: "Du må svare på om dere har utbetalt lønn under fraværet",
    }),
  ),
  årForRefusjon: z.preprocess(
    (val) => val || "",
    z.string().min(1, {
      message: "Du må svare på hvilket år du søker refusjon for",
    }),
  ),
});

// Step 2: Den ansatte og arbeidsgiver (Employee and employer)
export const Steg2AnsattOgArbeidsgiverSchema = z.object({
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
  organisasjonsnummer: z.string(),
  valgtArbeidsforhold: z.string().optional(),
});

// Step 3: Omsorgsdager (Care days)
export const Steg3OmsorgsdagerSchema = z.object({
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
});

// Step 4: Beregnet månedslønn (Calculated monthly salary)
export const Steg4BeregnetMånedslonnSchema = z.object({
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

// Combined schema for the entire form
export const RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema = z.object({
  // Steg 1
  ...Steg1RefusjonSchema.shape,
  // Steg 2
  ...Steg2AnsattOgArbeidsgiverSchema.shape,
  // Steg 3
  ...Steg3OmsorgsdagerSchema.shape,
  // Steg 4
  ...Steg4BeregnetMånedslonnSchema.shape,
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
    resolver: zodResolver(RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema),
    defaultValues: {
      // Default values for Step 1
      harUtbetaltLønn: "",
      årForRefusjon: "",
      // Default values for Step 2
      kontaktperson: {
        navn: lagFulltNavn(opplysninger),
        telefonnummer: opplysninger.telefon,
      },
      // Default values for Step 3
      fraværHeleDager: [],
      fraværDelerAvDagen: [],
      // Default values for Step 4
      refusjon: [],
      bortfaltNaturalytelsePerioder: [],
      endringAvInntektÅrsaker: [
        {
          årsak: "",
          fom: "",
          tom: "",
          bleKjentFom: "",
        },
      ],
    },
  });
  return <FormProvider {...formArgs}>{children}</FormProvider>;
};

export const useRefusjonOmsorgspengerArbeidsgiverFormContext = () => {
  return useFormContext<RefusjonOmsorgspengerArbeidsgiverSkjemaState>();
};

// Export functions to get validation schema for each step
export const getSteg1Schema = () => Steg1RefusjonSchema;
export const getSteg2Schema = () => Steg2AnsattOgArbeidsgiverSchema;
export const getSteg3Schema = () => Steg3OmsorgsdagerSchema;
export const getSteg4Schema = () => Steg4BeregnetMånedslonnSchema;
export const getFullSchema = () =>
  RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema;
