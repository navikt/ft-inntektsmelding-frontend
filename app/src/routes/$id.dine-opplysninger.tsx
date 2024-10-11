import { createFileRoute } from "@tanstack/react-router";

import { HjelpetekstToggle } from "~/features/Hjelpetekst.tsx";
import { Steg1DineOpplysninger } from "~/features/inntektsmelding/Steg1DineOpplysninger";

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <Steg1DineOpplysninger />
    </>
  ),
});
