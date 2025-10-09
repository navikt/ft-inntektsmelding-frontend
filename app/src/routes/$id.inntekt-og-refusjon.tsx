import { createFileRoute } from "@tanstack/react-router";

import { HjelpetekstToggle } from "~/features/shared/Hjelpetekst";
import { Steg2InntektOgRefusjon } from "~/features/inntektsmelding/steg/Steg2InntektOgRefusjon";

export const Route = createFileRoute("/$id/inntekt-og-refusjon")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <Steg2InntektOgRefusjon />
    </>
  ),
});
