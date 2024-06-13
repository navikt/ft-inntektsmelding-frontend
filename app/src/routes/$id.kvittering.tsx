import { createFileRoute } from "@tanstack/react-router";

import { hentOpplysningerData } from "~/api/queries";
import { Kvittering } from "~/views/kvittering/Kvittering";

export const Route = createFileRoute("/$id/kvittering")({
  component: Kvittering,
  loader: ({ params }) => hentOpplysningerData(params.id),
});
