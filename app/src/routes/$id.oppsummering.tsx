import { createFileRoute } from "@tanstack/react-router";

import { hentOpplysningerData } from "~/api/queries";
import { Oppsummering } from "~/views/oppsummering/Oppsummering";

export const Route = createFileRoute("/$id/oppsummering")({
  component: Oppsummering,
  loader: ({ params }) => hentOpplysningerData(params.id),
});
