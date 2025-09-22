import { createFileRoute } from "@tanstack/react-router";

import { HjelpetekstToggle } from "~/features/Hjelpetekst.tsx";
import { Steg2Refusjon } from "~/features/inntektsmelding/Steg2Refusjon";

export const Route = createFileRoute("/$id/refusjon")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <Steg2Refusjon />
    </>
  ),
});
