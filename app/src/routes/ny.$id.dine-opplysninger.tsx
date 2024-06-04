import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { forespørselQueryOptions } from "~/api/queries.ts";
import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";

const DineOpplysninger = () => {
  const { id } = Route.useParams();
  const forespørsel = useSuspenseQuery(forespørselQueryOptions(id)).data;

  return (
    <PersonOgSelskapsInformasjonSeksjon
      className="mt-6"
      forespørsel={forespørsel}
    />
  );
};

export const Route = createFileRoute("/ny/$id/dine-opplysninger")({
  component: DineOpplysninger,
});
