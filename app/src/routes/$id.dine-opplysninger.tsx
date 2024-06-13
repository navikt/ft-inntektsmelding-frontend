import { createFileRoute } from "@tanstack/react-router";

import { hentOpplysningerData } from "~/api/queries.ts";
import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";

const DineOpplysninger = () => {
  const data = Route.useLoaderData();

  return (
    <PersonOgSelskapsInformasjonSeksjon className="mt-6" opplysninger={data} />
  );
};

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: DineOpplysninger,
  loader: ({ params }) => hentOpplysningerData(params.id),
});
