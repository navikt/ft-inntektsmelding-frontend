import { BodyLong } from "@navikt/ds-react";

import { RotLayout } from "../../features/rot-layout/RotLayout";

export const EndreInntektsmelding = () => {
  return (
    <RotLayout tittel="Endre inntektsmelding" ytelse="Omsorgspenger">
      <BodyLong>
        Dette er siden for å endre inntektsmelding for omsorgspenger
      </BodyLong>
    </RotLayout>
  );
};
