import type { AlertProps, ReadMoreProps } from "@navikt/ds-react";
import { Alert, ReadMore, Switch } from "@navikt/ds-react";
import { type ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";

import { useLocalStorageState } from "~/features/usePersistedState.tsx";

export const VIS_HJELPETEKSTER_KEY = "vis-hjelpetekster";

type HjelpeTeksterContextType = {
  visHjelpeTekster: boolean;
  setVisHjelpeTekster: Dispatch<SetStateAction<boolean>>;
};
const VisHjelpeTeksterStateContext =
  createContext<HjelpeTeksterContextType | null>(null);

export const VisHjelpeTeksterStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [visHjelpeTekster, setVisHjelpeTekster] = useLocalStorageState<boolean>(
    VIS_HJELPETEKSTER_KEY,
    true,
  );
  return (
    <VisHjelpeTeksterStateContext.Provider
      value={{
        visHjelpeTekster,
        setVisHjelpeTekster,
      }}
    >
      {children}
    </VisHjelpeTeksterStateContext.Provider>
  );
};

export const useHjelpeTekst = () => {
  const context = useContext(VisHjelpeTeksterStateContext);
  if (!context) {
    throw new Error(
      "useHjelpeTekst må brukes inne i en InntektsmeldingSkjemaStateProvider",
    );
  }

  return context;
};

export function HjelpetekstToggle() {
  const { visHjelpeTekster, setVisHjelpeTekster } = useHjelpeTekst();

  return (
    <Switch
      checked={visHjelpeTekster}
      onChange={(e) => setVisHjelpeTekster(e.target.checked)}
    >
      Vis hjelpetekster i skjema
    </Switch>
  );
}

export function HjelpeTekst({
  header,
  children,
}: Pick<ReadMoreProps, "header" | "children">) {
  const { visHjelpeTekster } = useHjelpeTekst();

  if (!visHjelpeTekster) {
    return null;
  }

  return <ReadMore header={header}>{children}</ReadMore>;
}

export function HjelpeAlert({ children }: Pick<AlertProps, "children">) {
  const { visHjelpeTekster } = useHjelpeTekst();

  if (!visHjelpeTekster) {
    return null;
  }

  return <Alert variant="info">{children}</Alert>;
}
