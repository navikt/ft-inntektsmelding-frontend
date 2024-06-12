import { createFileRoute } from "@tanstack/react-router";

import { hentForespørselData } from "~/api/queries";
import { Oppsummering } from "~/views/oppsummering/Oppsummering";

export const Route = createFileRoute("/$id/oppsummering")({
  component: Oppsummering,
  loader: ({ params }) => hentForespørselData(params.id),
});
