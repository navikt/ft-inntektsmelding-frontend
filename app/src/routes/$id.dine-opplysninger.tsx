import { createFileRoute } from "@tanstack/react-router";

import { HjelpetekstToggle } from "~/features/shared/Hjelpetekst";
import { Steg1DineOpplysninger } from "~/features/inntektsmelding/steg/Steg1DineOpplysninger";

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <Steg1DineOpplysninger />
    </>
  ),
});
