import { createFileRoute } from "@tanstack/react-router";

import { Steg1DineOpplysninger } from "~/features/inntektsmelding/steg/Steg1DineOpplysninger";
import { HjelpetekstToggle } from "~/features/shared/Hjelpetekst";

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <Steg1DineOpplysninger />
    </>
  ),
});
