import { createFileRoute } from "@tanstack/react-router";

import { HjelpetekstToggle } from "~/features/Hjelpetekst";
import { Steg1DineOpplysningerAGI } from "~/features/inntektsmelding/Steg1DineOpplysninger";

export const Route = createFileRoute("/agi/dine-opplysninger")({
  component: () => {
    return (
      <>
        <HjelpetekstToggle />
        <Steg1DineOpplysningerAGI />
      </>
    );
  },
});
