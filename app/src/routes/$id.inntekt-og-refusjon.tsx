import { createFileRoute } from "@tanstack/react-router";

import { HjelpetekstToggle } from "~/features/Hjelpetekst.tsx";
import { Steg2InntektOgRefusjon } from "~/features/inntektsmelding/Steg2InntektOgRefusjon";

export const Route = createFileRoute("/$id/inntekt-og-refusjon")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <Steg2InntektOgRefusjon />
    </>
  ),
});
