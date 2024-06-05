import { Alert } from "@navikt/ds-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ny/$id/kvittering")({
  component: () => (
    <Alert className="mt-8" variant="success">
      Inntektsmelding sendt
    </Alert>
  ),
});
