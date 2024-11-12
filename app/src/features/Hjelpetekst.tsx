import { AlertProps, Page, ReadMoreProps } from "@navikt/ds-react";
import { Alert, ReadMore, Switch } from "@navikt/ds-react";
import { type ReactNode } from "@tanstack/react-router";
import { Dispatch, SetStateAction, useState } from "react";
import { createContext, useContext } from "react";
import { z } from "zod";

import { loggAmplitudeEvent } from "~/api/amplitude.ts";
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
    <Page.Block className="mt-2 mx-5 lg:mx-0" width="md">
      <Switch
        checked={visHjelpetekster.vis}
        onChange={(e) => {
          loggAmplitudeEvent({
            eventName: "toggle-hjelpetekster",
            eventData: { vis: e.target.checked.toString() },
          });
          setVisHjelpetekster({ vis: e.target.checked });
        }}
      >
        Vis hjelpetekster
      </Switch>
    </Page.Block>
  );
}

export function HjelpetekstReadMore({
  header,
  children,
}: Pick<ReadMoreProps, "children"> & { header: string }) {
  const { vis } = useHjelpetekst().visHjelpetekster;
  const [åpen, setÅpen] = useState(false);
  if (!vis) {
    return null;
  }

  return (
    <ReadMore
      header={header}
      onOpenChange={(open) => {
        setÅpen(open);
        loggAmplitudeEvent({
          eventName: open ? "readmore åpnet" : "readmore lukket",
          eventData: { tittel: header },
        });
      }}
      open={åpen}
    >
      {children}
    </ReadMore>
  );
}

export function HjelpetekstAlert({ children }: Pick<AlertProps, "children">) {
  const { vis } = useHjelpetekst().visHjelpetekster;

  if (!vis) {
    return null;
  }

  return <Alert variant="info">{children}</Alert>;
}
