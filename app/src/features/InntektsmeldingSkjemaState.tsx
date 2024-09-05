import { getRouteApi, type ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { z } from "zod";

import {
  ÅrsaksTypeSchema,
  NaturalytelseTypeSchema,
} from "~/types/api-models.ts";
import { beløpSchema } from "~/utils.ts";

import { useSessionStorageState } from "./usePersistedState";

export const InntektsmeldingSkjemaStateSchema = z.object({
  kontaktperson: z
    .object({
      navn: z.string(),
      telefonnummer: z.string(),
    })
    .optional(),
  inntekt: beløpSchema,
  inntektEndringsÅrsak: z
    .object({
      årsak: ÅrsaksTypeSchema,
      korrigertInntekt: beløpSchema,
      fom: z.date().optional(),
      tom: z.date().optional(),
    })
    .optional(),
  skalRefunderes: z.boolean().optional(),
  refusjonsbeløpPerMåned: beløpSchema,
  endringIRefusjon: z.boolean().optional(),
  refusjonsendringer: z.array(
    z.object({
      fom: z.date().optional(),
      beløp: beløpSchema,
    }),
  ),
  misterNaturalytelser: z.boolean().optional(),
  naturalytelserSomMistes: z.array(
    z.object({
      navn: z.union([NaturalytelseTypeSchema, z.literal("")]),
      beløp: beløpSchema,
      fom: z.date().optional(),
      tom: z.date().optional(),
      inkluderTom: z.boolean(),
    }),
  ),
});

export const InntektsmeldingSkjemaStateSchemaValidated = z.object({
  kontaktperson: z.object({
    navn: z.string(),
    telefonnummer: z.string(),
  }),
  inntekt: beløpSchema,
  inntektEndringsÅrsak: z
    .object({
      årsak: ÅrsaksTypeSchema,
      korrigertInntekt: beløpSchema,
      fom: z.date(),
      tom: z.date().optional(),
    })
    .optional(),
  skalRefunderes: z.boolean(),
  refusjonsbeløpPerMåned: beløpSchema,
  endringIRefusjon: z.boolean().optional(),
  refusjonsendringer: z.array(
    z.object({
      fom: z.date(),
      beløp: beløpSchema,
    }),
  ),
  misterNaturalytelser: z.boolean(),
  naturalytelserSomMistes: z.array(
    z.object({
      navn: NaturalytelseTypeSchema,
      beløp: beløpSchema,
      fom: z.date(),
      tom: z.date().optional(),
      inkluderTom: z.boolean(),
    }),
  ),
});

export type InntektsmeldingSkjemaState = z.infer<
  typeof InntektsmeldingSkjemaStateSchema
>;

export type InntektsmeldingSkjemaStateValid = z.infer<
  typeof InntektsmeldingSkjemaStateSchemaValidated
>;

type InntektsmeldingSkjemaStateContextType = {
  gyldigInntektsmeldingSkjemaState?: InntektsmeldingSkjemaStateValid;
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

const defaultSkjemaState = {
  inntekt: 0,
  refusjonsbeløpPerMåned: 0,
  refusjonsendringer: [],
  naturalytelserSomMistes: [],
};

export const InntektsmeldingSkjemaStateProvider = ({
  children,
}: InntektsmeldingSkjemaStateProviderProps) => {
  const route = getRouteApi("/$id");
  const { id } = route.useParams();

  const [state, setState] = useSessionStorageState<InntektsmeldingSkjemaState>(
    `skjemadata-${id}`,
    defaultSkjemaState,
    InntektsmeldingSkjemaStateSchema,
  );

  const gyldigInntektsmeldingSkjemaState =
    InntektsmeldingSkjemaStateSchemaValidated.safeParse(state);

  // TODO: Fjern før produksjon
  if (!gyldigInntektsmeldingSkjemaState.success) {
    console.error(
      "InntektsmeldingSkjemaState er ikke gyldig",
      gyldigInntektsmeldingSkjemaState.error,
    );
  }

  return (
    <InntektsmeldingSkjemaStateContext.Provider
      value={{
        inntektsmeldingSkjemaState: state,
        gyldigInntektsmeldingSkjemaState: gyldigInntektsmeldingSkjemaState.data,
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
