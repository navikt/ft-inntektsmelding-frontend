import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

import { forespørselQueryOptions } from "~/api/queries.ts";
import { RotLayout } from "~/features/rot-layout/RotLayout";

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
      <Outlet />
    </RotLayout>
  );
};
