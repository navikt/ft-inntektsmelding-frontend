import { createFileRoute } from "@tanstack/react-router";

import { Steg3Oppsummering } from "~/features/arbeidsgiverinitiert/steg/Steg3OppsummeringAGI";

export const Route = createFileRoute("/agi/$id/oppsummering")({
  component: Steg3Oppsummering,
});
