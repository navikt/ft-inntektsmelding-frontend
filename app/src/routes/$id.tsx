import { createFileRoute } from "@tanstack/react-router";

import { hentForespørselData } from "~/api/queries.ts";
import { NyInntektsmelding } from "~/views/ny-inntektsmelding/NyInntektsmelding";

export const Route = createFileRoute("/$id")({
  component: NyInntektsmelding,
  loader: ({ params }) => hentForespørselData(params.id),
});
