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
  kontaktperson: kontaktpersonSchema.nullable(),
  refusjon: refusjonSchema,
  skalRefunderes: skalRefunderesSchema.nullable(),
});

export const AGIValidatedInntektsmelding = z.object({
  kontaktperson: kontaktpersonSchema,
  refusjon: refusjonSchema,
  skalRefunderes: skalRefunderesSchema,
});

export type InntektsmeldingSkjemaState = z.infer<
  typeof InntektsmeldingSkjemaStateSchema
>;

export type InntektsmeldingSkjemaStateValid = z.infer<
  typeof AGIValidatedInntektsmelding
>;

type InntektsmeldingSkjemaStateContextTypeArbeidsgiverInitiert = {
  gyldigInntektsmeldingSkjemaState?: InntektsmeldingSkjemaStateValid;
  inntektsmeldingSkjemaStateError?: ZodError;
  inntektsmeldingSkjemaState: InntektsmeldingSkjemaState;
  setInntektsmeldingSkjemaState: Dispatch<
    SetStateAction<InntektsmeldingSkjemaState>
  >;
};
const InntektsmeldingSkjemaStateContextArbeidsgiverInitiert =
  createContext<InntektsmeldingSkjemaStateContextTypeArbeidsgiverInitiert | null>(
    null,
  );

type InntektsmeldingSkjemaStateProviderProps = {
  skjemaId: string;
  children: ReactNode;
};

const defaultSkjemaState = {
  kontaktperson: null,
  refusjon: [],
  skalRefunderes: null,
} satisfies InntektsmeldingSkjemaState;

export const InntektsmeldingSkjemaStateProvider = ({
  skjemaId,
  children,
}: InntektsmeldingSkjemaStateProviderProps) => {
  const [state, setState] = useSessionStorageState<InntektsmeldingSkjemaState>(
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
    <InntektsmeldingSkjemaStateContextArbeidsgiverInitiert.Provider
      value={{
        inntektsmeldingSkjemaState: state,
        gyldigInntektsmeldingSkjemaState: gyldigInntektsmeldingSkjemaState.data,
        inntektsmeldingSkjemaStateError: gyldigInntektsmeldingSkjemaState.error,
        setInntektsmeldingSkjemaState: setState,
      }}
    >
      {children}
    </InntektsmeldingSkjemaStateContextArbeidsgiverInitiert.Provider>
  );
};

/** Henter ut global skjematilstand, og lar deg manipulere den */
export const useInntektsmeldingSkjemaArbeidsgiverInitiert = () => {
  const context = useContext(
    InntektsmeldingSkjemaStateContextArbeidsgiverInitiert,
  );
  if (!context) {
    throw new Error(
      "useInntektsmeldingSkjema må brukes inne i en InntektsmeldingSkjemaStateProvider",
    );
  }

  return context;
};
