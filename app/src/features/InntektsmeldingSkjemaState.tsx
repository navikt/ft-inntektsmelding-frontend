import { getRouteApi, type ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { z, ZodError } from "zod";

import {
  EndringAvInntektÅrsakerSchema,
  NaturalytelseTypeSchema,
} from "~/types/api-models.ts";
import { beløpSchema, logDev } from "~/utils.ts";

import { useSessionStorageState } from "./usePersistedState";

/**
 * Minst streng skjema-state. Denne brukes underveis der mange av feltene er optional fordi de ikke er utfylt enda.
 */
export const InntektsmeldingSkjemaStateSchema = z.object({
  kontaktperson: z
    .object({
      navn: z.string(),
      telefonnummer: z.string(),
    })
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

/**
 * En strengere skjema state. Her er alle verdiene validert mot skjema-logikken.
 */
export const InntektsmeldingSkjemaStateSchemaValidated = z.object({
  kontaktperson: z.object({
    navn: z.string(),
    telefonnummer: z.string(),
  }),
  inntekt: beløpSchema,
  korrigertInntekt: beløpSchema.optional(),
  endringAvInntektÅrsaker: z.array(
    z.object({
      årsak: EndringAvInntektÅrsakerSchema,
      fom: z.string().optional(),
      tom: z.string().optional(),
      ignorerTom: z.boolean(),
      bleKjentFom: z.string().optional(),
    }),
  ),
  skalRefunderes: z.union([
    z.literal("JA_LIK_REFUSJON"),
    z.literal("JA_VARIERENDE_REFUSJON"),
    z.literal("NEI"),
  ]),
  refusjon: z.array(
    z.object({
      fom: z.string().optional(),
      beløp: beløpSchema,
    }),
  ),
  misterNaturalytelser: z.boolean(),
  bortfaltNaturalytelsePerioder: z.array(
    z.object({
      navn: NaturalytelseTypeSchema,
      beløp: beløpSchema,
      fom: z.string(),
      tom: z.string().optional(),
      inkluderTom: z.boolean(),
    }),
  ),
  // TODO: Disse burde flyttes til en egen schema for eksisterende inntektsmeldinger
  opprettetTidspunkt: z.string().optional(),
  id: z.number().optional(),
});

export type InntektsmeldingSkjemaState = z.infer<
  typeof InntektsmeldingSkjemaStateSchema
>;

export type InntektsmeldingSkjemaStateValid = z.infer<
  typeof InntektsmeldingSkjemaStateSchemaValidated
>;

type InntektsmeldingSkjemaStateContextType = {
  gyldigInntektsmeldingSkjemaState?: InntektsmeldingSkjemaStateValid;
  inntektsmeldingSkjemaStateError?: ZodError;
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
  refusjon: [],
  bortfaltNaturalytelsePerioder: [],
  endringAvInntektÅrsaker: [],
} satisfies InntektsmeldingSkjemaState;

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

  if (!gyldigInntektsmeldingSkjemaState.success) {
    logDev("error", gyldigInntektsmeldingSkjemaState.error);
  }

  return (
    <InntektsmeldingSkjemaStateContext.Provider
      value={{
        inntektsmeldingSkjemaState: state,
        gyldigInntektsmeldingSkjemaState: gyldigInntektsmeldingSkjemaState.data,
        inntektsmeldingSkjemaStateError: gyldigInntektsmeldingSkjemaState.error,
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
