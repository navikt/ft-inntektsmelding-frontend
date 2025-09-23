import { createFileRoute } from "@tanstack/react-router";

import { Steg3Oppsummering } from "~/features/inntektsmelding/arbeidsgiverInitiert/Steg3OppsummeringAGI";

export const Route = createFileRoute("/agi/oppsummering")({
  component: Steg3Oppsummering,
});
