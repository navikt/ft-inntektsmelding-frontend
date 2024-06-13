/* eslint-disable unicorn/prefer-top-level-await */
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { forespørselQueryOptions } from "~/api/queries.ts";
import { VIS_HJELPETEKSTER_KEY } from "~/features/HjelpeTekst.tsx";
import { getParsedLocalStorageItem } from "~/features/useLocalStorage.tsx";
import { NyInntektsmelding } from "~/views/ny-inntektsmelding/NyInntektsmelding";

const searchSchema = z.object({
  visHjelpeTekst: z
    .boolean()
    .catch(getParsedLocalStorageItem(VIS_HJELPETEKSTER_KEY, true)),
});

export const Route = createFileRoute("/$id")({
  component: NyInntektsmelding,
  validateSearch: searchSchema,
  loader: ({ context, params }) =>
    context.queryClient.prefetchQuery(forespørselQueryOptions(params.id)),
});
