import { getRouteApi, type ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { z } from "zod";

import { useSessionStorageState } from "~/features/usePersistedState";
import { ÅrsaksTypeSchema, NaturalytelseTypeSchema } from "~/types/api-models";
import { beløpSchema } from "~/utils";

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
        antallTimer: z.number().optional(),
      }),
    )
    .optional(),
  inntekt: beløpSchema.optional(),
  inntektEndringsÅrsak: z
    .object({
      årsak: ÅrsaksTypeSchema,
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
  naturalytelserSomMistes: z
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

type RefusjonOmsorgspengerArbeidsgiverSkjemaStateContextType = {
  refusjonOmsorgspengerArbeidsgiverSkjemaState: RefusjonOmsorgspengerArbeidsgiverSkjemaState;
  setRefusjonOmsorgspengerArbeidsgiverSkjemaState: Dispatch<
    SetStateAction<RefusjonOmsorgspengerArbeidsgiverSkjemaState>
  >;
};
const RefusjonOmsorgspengerArbeidsgiverSkjemaStateContext =
  createContext<RefusjonOmsorgspengerArbeidsgiverSkjemaStateContextType | null>(
    null,
  );

type RefusjonOmsorgspengerArbeidsgiverSkjemaStateProviderProps = {
  children: ReactNode;
};

const defaultSkjemaState = {};

export const RefusjonOmsorgspengerArbeidsgiverSkjemaStateProvider = ({
  children,
}: RefusjonOmsorgspengerArbeidsgiverSkjemaStateProviderProps) => {
  const route = getRouteApi("/$id");
  const { id } = route.useParams();

  const [state, setState] =
    useSessionStorageState<RefusjonOmsorgspengerArbeidsgiverSkjemaState>(
      `skjemadata-${id}`,
      defaultSkjemaState,
      RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema,
    );

  return (
    <RefusjonOmsorgspengerArbeidsgiverSkjemaStateContext.Provider
      value={{
        refusjonOmsorgspengerArbeidsgiverSkjemaState: state,
        setRefusjonOmsorgspengerArbeidsgiverSkjemaState: setState,
      }}
    >
      {children}
    </RefusjonOmsorgspengerArbeidsgiverSkjemaStateContext.Provider>
  );
};

/** Henter ut global skjematilstand, og lar deg manipulere den */
export const useRefusjonOmsorgspengerArbeidsgiverSkjema = () => {
  const context = useContext(
    RefusjonOmsorgspengerArbeidsgiverSkjemaStateContext,
  );
  if (!context) {
    throw new Error(
      "useRefusjonOmsorgspengerArbeidsgiverSkjema må brukes inne i en RefusjonOmsorgspengerArbeidsgiverSkjemaStateProvider",
    );
  }

  return context;
};
