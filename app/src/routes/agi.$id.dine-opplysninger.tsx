import { createFileRoute } from "@tanstack/react-router";

import { Steg1DineOpplysningerAGI } from "~/features/arbeidsgiverinitiert/steg/Steg1DineOpplysninger";
import { HjelpetekstToggle } from "~/features/shared/Hjelpetekst";

export const Route = createFileRoute("/agi/$id/dine-opplysninger")({
  component: () => {
    return (
      <>
        <HjelpetekstToggle />
        <Steg1DineOpplysningerAGI />
      </>
    );
  },
});
