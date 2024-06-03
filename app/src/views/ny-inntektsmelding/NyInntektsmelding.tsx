import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";

import { forespørselQueryOptions } from "~/api/queries.ts";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { PersonOgSelskapsInformasjonSeksjon } from "~/features/skjema-moduler/PersonOgSelskapsInformasjonSeksjon";

const route = getRouteApi("/ny/$id");

export const NyInntektsmelding = () => {
  const { id } = route.useParams();

  const forespørsel = useSuspenseQuery(forespørselQueryOptions(id)).data;

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/",
      },
      {
        title: "Inntektsmelding",
        url: `/ny/${id}`,
      },
    ]);
  }, [id]);

  return (
    <RotLayout tittel={`Ny inntektsmelding – ${forespørsel.ytelseType}`}>
      <PersonOgSelskapsInformasjonSeksjon
        className="mt-6"
        forespørsel={forespørsel}
      />
    </RotLayout>
  );
};
