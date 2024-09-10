import { createFileRoute } from "@tanstack/react-router";

import {
  hentEksisterendeInntektsmeldinger,
  hentOpplysningerData,
} from "~/api/queries";
import { NyInntektsmelding } from "~/views/ny-inntektsmelding/NyInntektsmelding";

export const Route = createFileRoute("/$id")({
  component: NyInntektsmelding,
  loader: async ({ params }) => {
    const [opplysninger, eksisterendeInntektsmeldinger] = await Promise.all([
      hentOpplysningerData(params.id),
      hentEksisterendeInntektsmeldinger(params.id),
    ]);

    return {
      opplysninger,
      eksisterendeInntektsmeldinger,
    };
  },
});
