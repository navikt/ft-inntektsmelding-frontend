import { createFileRoute } from "@tanstack/react-router";

import { HjelpetekstToggle } from "~/features/Hjelpetekst.tsx";
import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: () => (
    <>
      <HjelpetekstToggle />
      <PersonOgSelskapsInformasjonSeksjon />
    </>
  ),
});
