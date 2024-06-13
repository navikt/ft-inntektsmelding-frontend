import { createFileRoute } from "@tanstack/react-router";

import { hentForespørselData } from "~/api/queries.ts";
import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";

const DineOpplysninger = () => {
  const data = Route.useLoaderData();

  return (
    <PersonOgSelskapsInformasjonSeksjon className="mt-6" forespørsel={data} />
  );
};

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: DineOpplysninger,
  loader: ({ params }) => hentForespørselData(params.id),
});
