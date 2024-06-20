import type { ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";

import type { ÅrsaksType, Naturalytelsetype } from "~/types/api-models.ts";

import { useSessionStorageState } from "./usePersistedState";

export type InntektsmeldingSkjemaState = {
  kontaktperson?: { navn: string; telefonnummer: string };
  inntekt: number;
  inntektEndringsÅrsak?: {
    årsak: ÅrsaksType;
    korrigertInntekt: number;
    fom?: string;
    tom?: string;
  };
  skalRefunderes?: boolean;
  refusjonsbeløpPerMåned: number;
  endringIRefusjon?: boolean;
  refusjonsendringer: { fraOgMed: string; beløp: number }[];
  misterNaturalytelser?: boolean;
  naturalytelserSomMistes: {
    navn: Naturalytelsetype | "";
    beløp: number;
    fraOgMed: string;
  }[];
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
  // TODO: 1. cleare sessionStorage når en IM er sendt. 2. skjemadata basert på forspørsel-ID?
  const [state, setState] = useSessionStorageState<InntektsmeldingSkjemaState>(
    "skjemadata",
    {
      inntekt: 0,
      refusjonsbeløpPerMåned: 0,
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
