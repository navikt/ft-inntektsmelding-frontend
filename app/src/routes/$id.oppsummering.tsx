import { createFileRoute } from "@tanstack/react-router";

import { Oppsummering } from "~/views/oppsummering/Oppsummering";

export const Route = createFileRoute("/$id/oppsummering")({
  component: Oppsummering,
});
