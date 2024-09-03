import type { AlertProps, ReadMoreProps } from "@navikt/ds-react";
import { Alert, ReadMore, Switch } from "@navikt/ds-react";
import { type ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { z } from "zod";

import { useLocalStorageState } from "~/features/usePersistedState.tsx";

export const VIS_HJELPETEKSTER_KEY = "vis-hjelpetekster";

type HjelpeteksterContextType = {
  visHjelpetekster: boolean;
  setVisHjelpetekster: Dispatch<SetStateAction<boolean>>;
};
const VisHjelpeteksterStateContext =
  createContext<HjelpeteksterContextType | null>(null);

export const VisHjelpeteksterStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [visHjelpetekster, setVisHjelpetekster] = useLocalStorageState<boolean>(
    VIS_HJELPETEKSTER_KEY,
    true,
    z.string().transform((value) => value === "true"),
  );
  return (
    <VisHjelpeteksterStateContext.Provider
      value={{
        visHjelpetekster,
        setVisHjelpetekster,
      }}
    >
      {children}
    </VisHjelpeteksterStateContext.Provider>
  );
};

export const useHjelpetekst = () => {
  const context = useContext(VisHjelpeteksterStateContext);
  if (!context) {
    throw new Error(
      "useHjelpetekst må brukes inne i en VisHjelpeteksterStateProvider",
    );
  }

  return context;
};

export function HjelpetekstToggle() {
  const { visHjelpetekster, setVisHjelpetekster } = useHjelpetekst();

  return (
    <Switch
      checked={visHjelpetekster}
      onChange={(e) => setVisHjelpetekster(e.target.checked)}
    >
      Vis hjelpetekster
    </Switch>
  );
}

export function HjelpetekstReadMore({
  header,
  children,
}: Pick<ReadMoreProps, "header" | "children">) {
  const { visHjelpetekster } = useHjelpetekst();

  if (!visHjelpetekster) {
    return null;
  }

  return <ReadMore header={header}>{children}</ReadMore>;
}

export function HjelpetekstAlert({ children }: Pick<AlertProps, "children">) {
  const { visHjelpetekster } = useHjelpetekst();

  if (!visHjelpetekster) {
    return null;
  }

  return <Alert variant="info">{children}</Alert>;
}
