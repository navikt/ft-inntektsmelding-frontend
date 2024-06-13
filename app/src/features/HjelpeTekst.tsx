import type { AlertProps, ReadMoreProps } from "@navikt/ds-react";
import { Alert } from "@navikt/ds-react";
import { ReadMore, Switch } from "@navikt/ds-react";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { setLocalStorageItem } from "~/features/local-storage-utils.ts";

export const VIS_HJELPETEKSTER_KEY = "vis-hjelpe-tekster";

export function HjelpeTekstMasterSwitch() {
  const { visHjelpeTekst } = useSearch({ from: "/$id" });
  const navigate = useNavigate();

  const onHjelpeTekstChanged = (newValue: boolean) => {
    setLocalStorageItem(VIS_HJELPETEKSTER_KEY, newValue);
    navigate({
      search: (prevSearch) => ({ ...prevSearch, visHjelpeTekst: newValue }),
    });
  };

  return (
    <Switch
      checked={visHjelpeTekst}
      onChange={(e) => onHjelpeTekstChanged(e.target.checked)}
    >
      Vis hjelpetekster i skjema
    </Switch>
  );
}

export function HjelpeTekst({
  header,
  children,
}: Pick<ReadMoreProps, "header" | "children">) {
  const { visHjelpeTekst } = useSearch({ from: "/$id" });

  if (!visHjelpeTekst) {
    return <></>;
  }

  return <ReadMore header={header}>{children}</ReadMore>;
}

export function HjelpeAlert({ children }: Pick<AlertProps, "children">) {
  const { visHjelpeTekst } = useSearch({ from: "/$id" });

  if (!visHjelpeTekst) {
    return <></>;
  }

  return <Alert variant="info">{children}</Alert>;
}
