import { createFileRoute } from "@tanstack/react-router";

import { forespørselQueryOptions } from "~/api/queries.ts";
import { NyInntektsmelding } from "~/views/ny-inntektsmelding/NyInntektsmelding";

export const Route = createFileRoute("/$id")({
  component: NyInntektsmelding,
  loader: ({ context, params }) =>
    context.queryClient.prefetchQuery(forespørselQueryOptions(params.id)),
});
