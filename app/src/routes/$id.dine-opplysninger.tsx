import { createFileRoute } from "@tanstack/react-router";

import { hentOpplysningerData } from "~/api/queries.ts";
import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: PersonOgSelskapsInformasjonSeksjon,
  loader: ({ params }) => hentOpplysningerData(params.id),
});
