import { BodyLong } from "@navikt/ds-react";

import { RotLayout } from "~/features/rot-layout/RotLayout";

export const Kvittering = () => {
  return (
    <RotLayout tittel="Kvittering, inntektsmelding" ytelse="Omsorgspenger">
      <BodyLong>
        Dette er kvitteringen for inntektsmelding for omsorgspenger.
      </BodyLong>
    </RotLayout>
  );
};
