import type { AlertProps, ReadMoreProps } from "@navikt/ds-react";
import { Alert, ReadMore, Switch } from "@navikt/ds-react";
import { type ReactNode } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import { z } from "zod";

import { useLocalStorageState } from "~/features/usePersistedState.tsx";

export const VIS_HJELPETEKSTER_KEY = "vis-hjelpetekster";

type VisHjelpetekser = {
  vis: boolean;
};
type HjelpeteksterContextType = {
  visHjelpetekster: VisHjelpetekser;
  setVisHjelpetekster: Dispatch<SetStateAction<VisHjelpetekser>>;
};
const VisHjelpeteksterStateContext =
  createContext<HjelpeteksterContextType | null>(null);

export const VisHjelpeteksterStateProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [visHjelpetekster, setVisHjelpetekster] =
    useLocalStorageState<VisHjelpetekser>(
      VIS_HJELPETEKSTER_KEY,
      { vis: true },
      z.object({
        vis: z.boolean(),
      }),
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
      checked={visHjelpetekster.vis}
      onChange={(e) => setVisHjelpetekster({ vis: e.target.checked })}
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
