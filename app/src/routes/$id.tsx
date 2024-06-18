/* eslint-disable unicorn/prefer-top-level-await */
import { createFileRoute } from "@tanstack/react-router";

import { hentOpplysningerData } from "~/api/queries";
import { NyInntektsmelding } from "~/views/ny-inntektsmelding/NyInntektsmelding";

export const Route = createFileRoute("/$id")({
  component: NyInntektsmelding,
  loader: ({ params }) => hentOpplysningerData(params.id),
});
