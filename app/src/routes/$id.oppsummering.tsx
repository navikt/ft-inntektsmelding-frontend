import { createFileRoute } from "@tanstack/react-router";

import { Steg3Oppsummering } from "~/features/inntektsmelding/Steg3Oppsummering";

export const Route = createFileRoute("/$id/oppsummering")({
  component: Steg3Oppsummering,
});
