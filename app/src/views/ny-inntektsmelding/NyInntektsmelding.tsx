import { BodyLong } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";

import { arbeidsgiverQueryOptions } from "~/api/queries.ts";
import { RotLayout } from "~/features/rot-layout/RotLayout";

const route = getRouteApi("/ny/$id");

export const NyInntektsmelding = () => {
  const { id } = route.useParams();
  const res = useQuery(
    arbeidsgiverQueryOptions("2715347149890", "FORELDREPENGER"),
  );

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
    <RotLayout tittel="Ny inntektsmelding" ytelse="Omsorgspenger">
      <BodyLong>Dette er siden for nye omsorgspenger med id {id}</BodyLong>
      <BodyLong>Her er et navn fra backend {res.data?.navn}</BodyLong>
    </RotLayout>
  );
};
