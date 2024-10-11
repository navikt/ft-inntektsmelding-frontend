import { createFileRoute } from "@tanstack/react-router";

import { Steg4Kvittering } from "~/features/inntektsmelding/Steg4Kvittering";

export const Route = createFileRoute("/$id/kvittering")({
  component: Steg4Kvittering,
});
