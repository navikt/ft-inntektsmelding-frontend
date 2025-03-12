import { zodResolver } from "@hookform/resolvers/zod";
import { idnr } from "@navikt/fnrvalidator";
import { getRouteApi } from "@tanstack/react-router";
import {
  DeepPartial,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";

import { EndringAvInntektÅrsakerSchema } from "~/types/api-models";
import { beløpSchema, finnSenesteInntektsmelding, lagFulltNavn } from "~/utils";
import { validateInntekt, validateTimer } from "~/validators";

import { RefusjonOmsorgspengerResponseDto } from "./api/mutations";
import {
  datoErInnenforGyldigDatoIntervall,
  mapSendInntektsmeldingTilSkjema,
} from "./utils";

// Create a single unified form schema
const baseSchema = z.object({
  meta: z.object({
    step: z.number().min(1).max(5),
    skalKorrigereInntekt: z.boolean(),
    harSendtSøknad: z.boolean(),
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
});

export const RefusjonOmsorgspengerSchema = baseSchema.extend({
  meta: z.object({
    step: z.number().min(1).max(5),
    skalKorrigereInntekt: z.boolean(),
    harSendtSøknad: z.boolean(),
    forrigeSøknad: baseSchema.optional(),
    innsendtSøknadId: z.number().optional(),
  }),
});

export const RefusjonOmsorgspengerSchemaMedValidering =
  RefusjonOmsorgspengerSchema.superRefine((data, ctx) => {
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
      for (const [index, periode] of data.fraværHeleDager.entries()) {
        if (!periode.fom) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi en fra og med dato",
            path: ["fraværHeleDager", index, "fom"],
          });
        }
        if (!periode.tom) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi en til og med dato",
            path: ["fraværHeleDager", index, "tom"],
          });
        }
        if (
          periode.fom &&
          !datoErInnenforGyldigDatoIntervall(
            periode.fom,
            Number(data.årForRefusjon),
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Fraværet må være mellom ${data.årForRefusjon}.01.01 og ${data.årForRefusjon}.12.31`,
            path: ["fraværHeleDager", index, "fom"],
          });
        }
        if (
          periode.tom &&
          !datoErInnenforGyldigDatoIntervall(
            periode.tom,
            Number(data.årForRefusjon),
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Fraværet må være mellom ${data.årForRefusjon}.01.01 og ${data.årForRefusjon}.12.31`,
            path: ["fraværHeleDager", index, "tom"],
          });
        }
      }

      // Validate each item in fraværDelerAvDagen array
      for (const [index, dag] of data.fraværDelerAvDagen.entries()) {
        if (!dag.dato) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi en dato",
            path: ["fraværDelerAvDagen", index, "dato"],
          });
        }
        if (dag.timer) {
          const feilmelding = validateTimer(dag.timer);
          if (typeof feilmelding === "string") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: feilmelding,
              path: ["fraværDelerAvDagen", index, "timer"],
            });
          }
        } else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi antall timer",
            path: ["fraværDelerAvDagen", index, "timer"],
          });
        }
        if (
          !datoErInnenforGyldigDatoIntervall(
            dag.dato,
            Number(data.årForRefusjon),
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Fraværet må være mellom ${data.årForRefusjon}.01.01 og ${data.årForRefusjon}.12.31`,
            path: ["fraværDelerAvDagen", index, "dato"],
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
          message:
            "Månedsinntekten er satt til kr 0. Dersom dere har utbetalt lønn og krever refusjon må månedsinntekten være større en kr 0.",
          path: ["inntekt"],
        });
      }
      if (data.meta.skalKorrigereInntekt && !data.korrigertInntekt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Månedsinntekten er satt til kr 0. Dersom dere har utbetalt lønn og krever refusjon må månedsinntekten være større en kr 0.",
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
            // TODO: Validate that fom and tom based on årsak
          }
        } else {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Du må oppgi endringsårsak",
            path: ["endringAvInntektÅrsaker"],
          });
        }
      }
    }
  });

// Define form data type based on the schema
export type RefusjonOmsorgspengerFormData = z.infer<
  typeof RefusjonOmsorgspengerSchemaMedValidering
>;

type Props = {
  children: React.ReactNode;
};
export const RefusjonOmsorgspengerArbeidsgiverForm = ({ children }: Props) => {
  const route = getRouteApi("/refusjon-omsorgspenger/$organisasjonsnummer");

  const { eksisterendeInntektsmeldinger, opplysninger, innloggetBruker } =
    route.useLoaderData();
  const { id } = route.useSearch();
  let defaultValues: DeepPartial<RefusjonOmsorgspengerFormData>;

  if (id) {
    const sisteInntektsmelding = finnSenesteInntektsmelding(
      eksisterendeInntektsmeldinger as RefusjonOmsorgspengerResponseDto[],
    );

    defaultValues = mapSendInntektsmeldingTilSkjema(
      opplysninger,
      sisteInntektsmelding,
    );
  } else {
    defaultValues = {
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
    };
  }

  const form = useForm<RefusjonOmsorgspengerFormData>({
    resolver: zodResolver(RefusjonOmsorgspengerSchemaMedValidering),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};

export const useRefusjonOmsorgspengerArbeidsgiverFormContext = () => {
  return useFormContext<RefusjonOmsorgspengerFormData>();
};
