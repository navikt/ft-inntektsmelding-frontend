import { BodyLong } from "@navikt/ds-react";

import { RotLayout } from "~/features/rot-layout/RotLayout";

export const NyInntektsmelding = () => {
  return (
    <RotLayout tittel="Ny inntektsmelding" ytelse="Omsorgspenger">
      <BodyLong>Dette er siden for nye omsorgspenger</BodyLong>
    </RotLayout>
  );
};
