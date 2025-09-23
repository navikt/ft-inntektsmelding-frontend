import { type ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { z, ZodError } from "zod";

import { useSessionStorageState } from "~/features/usePersistedState";
import { beløpSchema, logDev } from "~/utils.ts";

const kontaktpersonSchema = z.object({
  navn: z.string(),
  telefonnummer: z.string(),
});

const refusjonSchema = z.array(
  z.object({
    fom: z.string(),
    beløp: beløpSchema,
  }),
);

const skalRefunderesSchema = z.union([
  z.literal("JA_LIK_REFUSJON"),
  z.literal("JA_VARIERENDE_REFUSJON"),
  z.literal("NEI"),
]);

export const InntektsmeldingSkjemaStateSchema = z.object({
  kontaktperson: kontaktpersonSchema,
  refusjon: refusjonSchema,
  skalRefunderes: skalRefunderesSchema.nullable(),
});

export const AGIValidatedInntektsmelding = z.object({
  kontaktperson: kontaktpersonSchema,
  refusjon: refusjonSchema,
  skalRefunderes: skalRefunderesSchema,
});

export type InntektsmeldingSkjemaStateAGI = z.infer<
  typeof InntektsmeldingSkjemaStateSchema
>;

export type InntektsmeldingSkjemaStateValidAGI = z.infer<
  typeof AGIValidatedInntektsmelding
>;

type InntektsmeldingSkjemaStateContextTypeArbeidsgiverInitiert = {
  gyldigInntektsmeldingSkjemaState?: InntektsmeldingSkjemaStateValidAGI;
  inntektsmeldingSkjemaStateError?: ZodError;
  inntektsmeldingSkjemaState: InntektsmeldingSkjemaStateAGI;
  setInntektsmeldingSkjemaState: Dispatch<
    SetStateAction<InntektsmeldingSkjemaStateAGI>
  >;
};
const InntektsmeldingSkjemaStateContextAGI =
  createContext<InntektsmeldingSkjemaStateContextTypeArbeidsgiverInitiert | null>(
    null,
  );

type InntektsmeldingSkjemaStateProviderProps = {
  skjemaId: string;
  children: ReactNode;
};

const defaultSkjemaState = {
  kontaktperson: {
    navn: "",
    telefonnummer: "",
  },
  refusjon: [],
  skalRefunderes: null,
} satisfies InntektsmeldingSkjemaStateAGI;

export const InntektsmeldingSkjemaStateProviderAGI = ({
  skjemaId,
  children,
}: InntektsmeldingSkjemaStateProviderProps) => {
  const [state, setState] =
    useSessionStorageState<InntektsmeldingSkjemaStateAGI>(
      `skjemadata-${skjemaId}`,
      defaultSkjemaState,
      AGIValidatedInntektsmelding,
    );

  const gyldigInntektsmeldingSkjemaState =
    AGIValidatedInntektsmelding.safeParse(state);

  if (!gyldigInntektsmeldingSkjemaState.success) {
    logDev("error", gyldigInntektsmeldingSkjemaState.error);
  }

  return (
    <InntektsmeldingSkjemaStateContextAGI.Provider
      value={{
        inntektsmeldingSkjemaState: state,
        gyldigInntektsmeldingSkjemaState: gyldigInntektsmeldingSkjemaState.data,
        inntektsmeldingSkjemaStateError: gyldigInntektsmeldingSkjemaState.error,
        setInntektsmeldingSkjemaState: setState,
      }}
    >
      {children}
    </InntektsmeldingSkjemaStateContextAGI.Provider>
  );
};

/** Henter ut global skjematilstand, og lar deg manipulere den */
export const useInntektsmeldingSkjemaAGI = () => {
  const context = useContext(InntektsmeldingSkjemaStateContextAGI);
  if (!context) {
    throw new Error(
      "useInntektsmeldingSkjemaAGI må brukes inne i en InntektsmeldingSkjemaStateProviderAGI",
    );
  }

  return context;
};
