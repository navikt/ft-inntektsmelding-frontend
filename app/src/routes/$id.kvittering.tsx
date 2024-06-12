import { createFileRoute } from "@tanstack/react-router";

import { hentForespørselData } from "~/api/queries";
import { Kvittering } from "~/views/kvittering/Kvittering";

export const Route = createFileRoute("/$id/kvittering")({
  component: Kvittering,
  loader: ({ params }) => hentForespørselData(params.id),
});
