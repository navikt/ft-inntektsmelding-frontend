import { zodResolver } from "@hookform/resolvers/zod";
import { idnr } from "@navikt/fnrvalidator";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { EndringAvInntektÅrsakerSchema } from "~/types/api-models";
import { beløpSchema, lagFulltNavn } from "~/utils";
import { validateInntekt } from "~/validators";

import { useInnloggetBruker } from "./useInnloggetBruker";

// Create a single unified form schema
export const RefusjonOmsorgspengerSchema = z
  .object({
    meta: z.object({
      step: z.number().min(1).max(5),
      skalKorrigereInntekt: z.boolean(),
      harSendtSøknad: z.boolean(),
      innsendtSøknadId: z.number().optional(),
    }),
    // Steg 1 fields
    harUtbetaltLønn: z.preprocess((val) => val || "", z.string()),
    årForRefusjon: z.preprocess((val) => val || "", z.string()),

    // Steg 2 fields
    kontaktperson: z.object({
      navn: z.string(),
      telefonnummer: z.string(),
    }),
    ansattesFødselsnummer: z.string().optional(),
    ansattesFornavn: z.string().optional(),
    ansattesEtternavn: z.string().optional(),
    ansattesAktørId: z.string().optional(),
    organisasjonsnummer: z.string().optional(),
    valgtArbeidsforhold: z.string().optional(),

    // Steg 3 fields
    harDekket10FørsteOmsorgsdager: z.preprocess((val) => val || "", z.string()),
    fraværHeleDager: z.array(
      z.object({
        fom: z.string(),
        tom: z.string(),
      }),
    ),
    fraværDelerAvDagen: z.array(
      z.object({
        dato: z.string(),
        timer: z.string(),
      }),
    ),

    // Steg 4 fields
    inntekt: beløpSchema.optional(),
    korrigertInntekt: beløpSchema.optional(),
    endringAvInntektÅrsaker: z
      .array(
        z.object({
          årsak: EndringAvInntektÅrsakerSchema.or(z.literal("")),
          fom: z.string().optional(),
          tom: z.string().optional(),
          bleKjentFom: z.string().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validations for Step 1
    if (data.meta.step === 1 || data.meta.step === 5) {
      if (!data.harUtbetaltLønn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må svare på om dere har utbetalt lønn under fraværet",
          path: ["harUtbetaltLønn"],
        });
      }
      if (!data.årForRefusjon) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må svare på hvilket år du søker refusjon for",
          path: ["årForRefusjon"],
        });
      }
    }

    // Validations for Step 2
    if (data.meta.step === 2 || data.meta.step === 5) {
      if (!data.kontaktperson?.navn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må oppgi navn på kontaktperson",
          path: ["kontaktperson", "navn"],
        });
      }
      if (!data.kontaktperson?.telefonnummer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må oppgi et telefonnummer for kontaktpersonen",
          path: ["kontaktperson", "telefonnummer"],
        });
      }
      if (!/^(\d{8}|\+\d+)$/.test(data.kontaktperson.telefonnummer)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Telefonnummer må være 8 siffer, eller 10 siffer med landkode",
          path: ["kontaktperson", "telefonnummer"],
        });
      }
      if (!data.ansattesFødselsnummer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må oppgi fødselsnummer eller d-nummer for den ansatte",
          path: ["ansattesFødselsnummer"],
        });
      }
      if (data.ansattesFødselsnummer) {
        const validationResult = idnr(data.ansattesFødselsnummer);
        const ugyldig = validationResult.status !== "valid";

        if (ugyldig) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Fødselsnummer eller d-nummer er ikke gyldig",
            path: ["ansattesFødselsnummer"],
          });
        }
      }
      if (!data.organisasjonsnummer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må oppgi et organisasjonsnummer",
          path: ["organisasjonsnummer"],
        });
      }
    }

    // Validations for Step 3
    if (data.meta.step === 3 || data.meta.step === 5) {
      if (!data.harDekket10FørsteOmsorgsdager) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må svare på om dere har dekket 10 første omsorgsdager",
          path: ["harDekket10FørsteOmsorgsdager"],
        });
      }

      const hasHeleDager = data.fraværHeleDager.length > 0;
      const hasDelerAvDagen = data.fraværDelerAvDagen.length > 0;

      if (!hasHeleDager && !hasDelerAvDagen) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Du må oppgi fravær enten som hele dager eller deler av dager",
          path: ["fraværHeleDager"],
        });
      }

      // Validate each item in fraværHeleDager array
      for (const [index, dag] of data.fraværHeleDager.entries()) {
        if (!dag.fom) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi en fra og med dato",
            path: ["fraværHeleDager", index, "fom"],
          });
        }
        if (!dag.tom) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi en til og med dato",
            path: ["fraværHeleDager", index, "tom"],
          });
        }
      }

      // Validate each item in fraværDelerAvDagen array
      for (const [index, del] of data.fraværDelerAvDagen.entries()) {
        if (!del.dato) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi en dato",
            path: ["fraværDelerAvDagen", index, "dato"],
          });
        }
        if (!del.timer) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi antall timer",
            path: ["fraværDelerAvDagen", index, "timer"],
          });
        }
      }
    }

    // Validations for Step 4
    if (data.meta.step === 4 || data.meta.step === 5) {
      // eslint-disable-next-line unicorn/no-lonely-if
      if (!data.meta.skalKorrigereInntekt && !data.inntekt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må oppgi enten korrigert inntekt eller inntekt",
          path: ["korrigertInntekt", "inntekt"],
        });
      }
      if (data.meta.skalKorrigereInntekt && !data.korrigertInntekt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Du må oppgi korrigert inntekt",
          path: ["korrigertInntekt"],
        });
      }
      if (data.korrigertInntekt) {
        const feilmelding = validateInntekt(data.korrigertInntekt, 0);
        if (typeof feilmelding === "string") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: feilmelding,
            path: ["korrigertInntekt"],
          });
        }
        if (data.endringAvInntektÅrsaker) {
          for (const [index, årsak] of data.endringAvInntektÅrsaker.entries()) {
            if (!årsak.årsak) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Du må oppgi en endringsårsak",
                path: ["endringAvInntektÅrsaker", index, "årsak"],
              });
            }
          }
        } else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi endringsårsaker",
            path: ["endringAvInntektÅrsaker"],
          });
        }
      }
    }
  });

// Define form data type based on the schema
export type RefusjonOmsorgspengerFormData = z.infer<
  typeof RefusjonOmsorgspengerSchema
>;

type Props = {
  children: React.ReactNode;
};

export const RefusjonOmsorgspengerArbeidsgiverForm = ({ children }: Props) => {
  const innloggetBruker = useInnloggetBruker();

  const form = useForm<RefusjonOmsorgspengerFormData>({
    resolver: zodResolver(RefusjonOmsorgspengerSchema),
    defaultValues: {
      meta: {
        step: 1,
        skalKorrigereInntekt: false,
        harSendtSøknad: false,
      },
      fraværHeleDager: [],
      fraværDelerAvDagen: [],
      kontaktperson: {
        navn: innloggetBruker?.fornavn ? lagFulltNavn(innloggetBruker) : "",
        telefonnummer: innloggetBruker?.telefon || "",
      },
      endringAvInntektÅrsaker: [
        {
          årsak: "",
          fom: "",
          tom: "",
        },
      ],
    },
    mode: "onChange",
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};

export const useRefusjonOmsorgspengerArbeidsgiverFormContext = () => {
  return useFormContext<RefusjonOmsorgspengerFormData>();
};
