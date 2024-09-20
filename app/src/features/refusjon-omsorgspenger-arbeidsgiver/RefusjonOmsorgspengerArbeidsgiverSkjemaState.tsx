import { getRouteApi, type ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { z } from "zod";

import { useSessionStorageState } from "~/features/usePersistedState";

export const RefusjonOmsorgspengerArbeidsgiverSkjemaStateSchema = z.object({
  kontaktperson: z
    .object({
      navn: z.string(),
      telefonnummer: z.string(),
    })
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
