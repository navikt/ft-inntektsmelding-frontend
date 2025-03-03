import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { EndringAvInntektÅrsakerSchema } from "~/types/api-models";
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
  kontaktperson: z.object({
    navn: z.string().min(1, {
      message: "Du må oppgi navn på kontaktperson",
    }),
    telefonnummer: z.string().min(1, {
      message: "Du må oppgi et telefonnummer for kontaktpersonen",
    }),
  }),
  ansattesFødselsnummer: z.string().min(1, {
    message: "Du må oppgi fødselsnummer for den ansatte",
  }),
  ansattesFornavn: z.string().optional(),
  ansattesEtternavn: z.string().optional(),
  ansattesAktørId: z.string().optional(),
  organisasjonsnummer: z.string().min(1, {
    message: "Du må oppgi et organisasjonsnummer",
  }),
  valgtArbeidsforhold: z.string().optional(),
});

// Step 3: Omsorgsdager (Care days)
export const Steg3OmsorgsdagerSchema = z.object({
  harDekket10FørsteOmsorgsdager: z.preprocess(
    (val) => val || "",
    z.string().min(1, {
      message: "Du må svare på om dere har dekket 10 første omsorgsdager",
    }),
  ),
  fraværHeleDager: z.array(
    z.object({
      fom: z.string().min(1, {
        message: "Du må oppgi en fra og med dato",
      }),
      tom: z.string().min(1, {
        message: "Du må oppgi en til og med dato",
      }),
    }),
  ),
  fraværDelerAvDagen: z.array(
    z.object({
      dato: z.string().min(1, {
        message: "Du må oppgi en dato",
      }),
      timer: z.string().min(1, {
        message: "Du må oppgi antall timer",
      }),
    }),
  ),
});

// Step 4: Beregnet månedslønn (Calculated monthly salary)
export const Steg4BeregnetMånedslonnSchema = z.object({
  inntekt: beløpSchema.optional(),
  korrigertInntekt: beløpSchema.optional(),
  endringAvInntektÅrsaker: z
    .array(
      z.object({
        årsak: EndringAvInntektÅrsakerSchema,
        fom: z.string().optional(),
        tom: z.string().optional(),
        bleKjentFom: z.string().optional(),
      }),
    )
    .optional(),
});

// Combined schema for the entire form
export const RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema = z.object({
  // Add steg field to track current step
  steg: z.number().int().min(1).max(5),
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

const schemaForStep = (step: 1 | 2 | 3 | 4 | 5) => {
  switch (step) {
    case 1: {
      return Steg1RefusjonSchema.extend(
        Steg2AnsattOgArbeidsgiverSchema.partial().shape,
      );
    }
    case 2: {
      return z.object({
        ...Steg1RefusjonSchema.shape,
        ...Steg2AnsattOgArbeidsgiverSchema.shape,
      });
    }
    case 3: {
      return z
        .object({
          ...Steg1RefusjonSchema.shape,
          ...Steg2AnsattOgArbeidsgiverSchema.shape,
          ...Steg3OmsorgsdagerSchema.shape,
        })
        .refine(
          (data) => {
            return (
              data.fraværHeleDager.length > 0 ||
              data.fraværDelerAvDagen.length > 0
            );
          },
          {
            message:
              "Du må oppgi fravær enten som hele dager eller deler av dager",
            path: ["fraværHeleDager"],
          },
        );
    }
    case 4: {
      return z.object({
        ...Steg1RefusjonSchema.shape,
        ...Steg2AnsattOgArbeidsgiverSchema.shape,
        ...Steg3OmsorgsdagerSchema.shape,
        ...Steg4BeregnetMånedslonnSchema.shape,
      });
    }
    case 5: {
      return z.object({
        ...Steg1RefusjonSchema.shape,
        ...Steg2AnsattOgArbeidsgiverSchema.shape,
        ...Steg3OmsorgsdagerSchema.shape,
        ...Steg4BeregnetMånedslonnSchema.shape,
      });
    }
  }
};

type SchemaTypes = z.infer<ReturnType<typeof schemaForStep>>;

type Props = {
  children: React.ReactNode;
  step: 1 | 2 | 3 | 4 | 5;
};
export const RefusjonOmsorgspengerArbeidsgiverForm = ({
  step,
  children,
}: Props) => {
  const innloggetBruker = useInnloggetBruker();
  const formArgs = useForm<SchemaTypes>({
    resolver: zodResolver(schemaForStep(step)),
    defaultValues: {
      // Default values for Step 1
      harUtbetaltLønn: "",
      årForRefusjon: "",
      // Default values for Step 2
      kontaktperson: {
        navn: lagFulltNavn(innloggetBruker),
        telefonnummer: innloggetBruker.telefon,
      },
      ansattesFødselsnummer: "",
      ansattesFornavn: "",
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
