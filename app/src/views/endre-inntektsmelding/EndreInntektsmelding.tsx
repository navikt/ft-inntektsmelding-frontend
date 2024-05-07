import { BodyLong } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";

import { RotLayout } from "~/features/rot-layout/RotLayout";

const route = getRouteApi("/endre/$id");

export const EndreInntektsmelding = () => {
  const { id } = route.useParams();
  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/",
      },
      {
        title: "Endre inntektsmelding",
        url: `/endre/${id}`,
      },
    ]);
  }, [id]);
  return (
    <RotLayout tittel="Endre inntektsmelding" ytelse="Omsorgspenger">
      <BodyLong>
        Dette er siden for å endre inntektsmelding for omsorgspenger
      </BodyLong>
    </RotLayout>
  );
};
