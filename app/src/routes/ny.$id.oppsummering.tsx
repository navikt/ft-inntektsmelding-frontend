import { createFileRoute } from "@tanstack/react-router";

import { Oppsummering } from "~/views/oppsummering/Oppsummering";

export const Route = createFileRoute("/ny/$id/oppsummering")({
  component: Oppsummering,
});
