import type { ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useState } from "react";

export type InntektsmeldingSkjemaState = {
  kontaktperson?: { navn: string; telefon: string };
  korrigertMånedslønn?: number;
  skalRefunderes?: boolean;
  refusjonsbeløpPerMåned?: number;
  endringIRefusjon?: boolean;
  refusjonsendringer?: { måned: string; beløp: number }[];
  misterNaturalytelser?: boolean;
  naturalytelserSomMistes?: { navn: string; beløp: number; fraOgMed: string }[];
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
  const [state, setState] = useState<InntektsmeldingSkjemaState>({});
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
