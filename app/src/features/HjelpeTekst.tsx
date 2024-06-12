import type { ReadMoreProps } from "@navikt/ds-react";
import { ReadMore, Switch } from "@navikt/ds-react";
import { useState } from "react";

const VIS_HJELPETEKSTER_KEY = "vis-hjelpe-tekster";

export function HjelpeTekstMasterSwitch() {
  const [isActive, setIsActive] = useState<boolean>(
    window.localStorage.getItem(VIS_HJELPETEKSTER_KEY) === "true",
  );

  const toggle = (value: boolean) => {
    window.localStorage.setItem("vis-hjelpe-tekster", value.toString());
    setIsActive(value);
  };

  return (
    <Switch
      onChange={(e) => toggle(e.target.value === "true")}
      value={isActive ? "true" : "false"}
    >
      Vis hjelpetekster i skjema
    </Switch>
  );
}

export function HjelpeTekst({
  header,
  children,
}: Pick<ReadMoreProps, "header" | "children">) {
  const visHjelpeTekst =
    window.localStorage.getItem(VIS_HJELPETEKSTER_KEY) === "true"; // TODO: ikke reaktiv

  if (!visHjelpeTekst) {
    return <></>;
  }

  return <ReadMore header={header}>{children}</ReadMore>;
}
