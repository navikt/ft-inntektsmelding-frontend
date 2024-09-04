import { createFileRoute } from "@tanstack/react-router";

import {
  hentEksisterendeInntektsmeldinger,
  hentOpplysningerData,
} from "~/api/queries";
import { NyInntektsmelding } from "~/views/ny-inntektsmelding/NyInntektsmelding";

export const Route = createFileRoute("/$id")({
  component: NyInntektsmelding,
  loader: async ({ params }) => {
    const opplysningerPromise = hentOpplysningerData(params.id);
    const eksisterendeInntektsmeldinger = hentEksisterendeInntektsmeldinger(
      params.id,
    );

    return await opplysningerPromise;
  },
});
