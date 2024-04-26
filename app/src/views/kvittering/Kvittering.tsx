import { BodyLong } from "@navikt/ds-react";
import { setBreadcrumbs } from "@navikt/nav-dekoratoren-moduler";
import { useEffect } from "react";

import { RotLayout } from "~/features/rot-layout/RotLayout";
import { Route } from "~/routes/kvittering.$id";

export const Kvittering = () => {
  const { id } = Route.useParams();
  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Min side – Arbeidsgiver",
        url: "/",
      },
      {
        title: "Kvittering, inntektsmelding",
        url: `/kvittering/${id}`,
      },
    ]);
  }, [id]);
  return (
    <RotLayout tittel="Kvittering, inntektsmelding" ytelse="Omsorgspenger">
      <BodyLong>
        Dette er kvitteringen for inntektsmelding for omsorgspenger.
      </BodyLong>
    </RotLayout>
  );
};
