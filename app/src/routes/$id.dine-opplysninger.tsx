import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon.tsx";

const DineOpplysninger = () => {
  const opplysninger = useLoaderData({ from: "/$id" });

  return (
    <PersonOgSelskapsInformasjonSeksjon
      className="mt-6"
      opplysninger={opplysninger}
    />
  );
};

export const Route = createFileRoute("/$id/dine-opplysninger")({
  component: DineOpplysninger,
});
