import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { forespørselQueryOptions } from "~/api/queries.ts";
import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";

const DineOpplysninger = () => {
  const { id } = Route.useParams();
  const inntektsmeldingDialogDto = useSuspenseQuery(
    forespørselQueryOptions(id),
  ).data;

  return (
    <PersonOgSelskapsInformasjonSeksjon
      className="mt-6"
      inntektsmeldingDialogDto={inntektsmeldingDialogDto}
    />
  );
};

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: DineOpplysninger,
});
