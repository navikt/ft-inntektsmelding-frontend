import { createFileRoute } from "@tanstack/react-router";

import { Steg2Refusjon } from "~/features/arbeidsgiverinitiert/Steg2Refusjon";
import { HjelpetekstToggle } from "~/features/Hjelpetekst.tsx";

export const Route = createFileRoute("/agi/$id/refusjon")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <Steg2Refusjon />
    </>
  ),
});
