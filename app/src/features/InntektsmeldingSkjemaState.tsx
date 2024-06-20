import type { ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";

import { useSessionStorageState } from "./usePersistedState";

export type InntektsmeldingSkjemaState = {
  kontaktperson?: { navn: string; telefon: string };
  korrigertMånedslønn?: {
    beløp?: number;
    endringsgrunn?: string; // TODO: Gjøre denne typesikker via en enum eller lignende?
    ekstraData?: { [key: string]: string }[]; // TODO: Gjøre denne mer typesikker?
  };
  skalRefunderes?: boolean;
  refusjonsbeløpPerMåned?: number;
  endringIRefusjon?: boolean;
  refusjonsendringer: { måned: string; beløp: number }[];
  misterNaturalytelser?: boolean;
  naturalytelserSomMistes: { navn: string; beløp: number; fraOgMed: string }[];
};

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
  const [state, setState] = useSessionStorageState<InntektsmeldingSkjemaState>(
    "skjemadata",
    {
      refusjonsendringer: [],
      naturalytelserSomMistes: [],
    },
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
