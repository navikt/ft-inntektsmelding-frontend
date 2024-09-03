import type { ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { z } from "zod";

import {
  ÅrsaksTypeSchema,
  NaturalytelseTypeSchema,
} from "~/types/api-models.ts";

import { useSessionStorageState } from "./usePersistedState";

const kontaktpersonSchema = z.object({
  navn: z.string(),
  telefonnummer: z.string(),
});

const inntektEndringsÅrsakSchema = z.object({
  årsak: ÅrsaksTypeSchema,
  korrigertInntekt: z.number(),
  fom: z.string().optional(),
  tom: z.string().optional(),
});

const refusjonsendringerSchema = z.object({
  fom: z.string(),
  beløp: z.number(),
});

const naturalytelserSomMistesSchema = z.object({
  navn: z.union([NaturalytelseTypeSchema, z.literal("")]),
  beløp: z.number(),
  fom: z.string(),
  tom: z.string().optional(),
  inkluderTom: z.boolean(),
});

export const InntektsmeldingSkjemaStateSchema = z.object({
  kontaktperson: kontaktpersonSchema.optional(),
  inntekt: z.number(),
  inntektEndringsÅrsak: inntektEndringsÅrsakSchema.optional(),
  skalRefunderes: z.boolean().optional(),
  refusjonsbeløpPerMåned: z.number(),
  endringIRefusjon: z.boolean().optional(),
  refusjonsendringer: z.array(refusjonsendringerSchema),
  misterNaturalytelser: z.boolean().optional(),
  naturalytelserSomMistes: z.array(naturalytelserSomMistesSchema),
});

export type InntektsmeldingSkjemaState = z.infer<
  typeof InntektsmeldingSkjemaStateSchema
>;

type InntektsmeldingSkjemaStateContextType = {
  inntektsmeldingSkjemaState: InntektsmeldingSkjemaState;
  setInntektsmeldingSkjemaState: Dispatch<
    SetStateAction<InntektsmeldingSkjemaState>
  >;
};
const InntektsmeldingSkjemaStateContext =
  createContext<InntektsmeldingSkjemaStateContextType | null>(null);

type InntektsmeldingSkjemaStateProviderProps = {
  children: ReactNode;
};
export const InntektsmeldingSkjemaStateProvider = ({
  children,
}: InntektsmeldingSkjemaStateProviderProps) => {
  // TODO: 1. cleare sessionStorage når en IM er sendt. 2. skjemadata basert på forspørsel-ID?
  const [state, setState] = useSessionStorageState<InntektsmeldingSkjemaState>(
    "skjemadata",
    {
      inntekt: 0,
      refusjonsbeløpPerMåned: 0,
      refusjonsendringer: [],
      naturalytelserSomMistes: [],
    },
    InntektsmeldingSkjemaStateSchema,
  );
  return (
    <InntektsmeldingSkjemaStateContext.Provider
      value={{
        inntektsmeldingSkjemaState: state,
        setInntektsmeldingSkjemaState: setState,
      }}
    >
      {children}
    </InntektsmeldingSkjemaStateContext.Provider>
  );
};

/** Henter ut global skjematilstand, og lar deg manipulere den */
export const useInntektsmeldingSkjema = () => {
  const context = useContext(InntektsmeldingSkjemaStateContext);
  if (!context) {
    throw new Error(
      "useInntektsmeldingSkjema må brukes inne i en InntektsmeldingSkjemaStateProvider",
    );
  }

  return context;
};
