import { createFileRoute } from "@tanstack/react-router";

import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: PersonOgSelskapsInformasjonSeksjon,
});
