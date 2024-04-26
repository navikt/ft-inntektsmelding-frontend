import { BodyLong } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useEffect } from "react";

import { RotLayout } from "~/features/rot-layout/RotLayout";
import { Route } from "~/routes/ny.$id";

export const NyInntektsmelding = () => {
  const { id } = Route.useParams();
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
    </RotLayout>
  );
};
