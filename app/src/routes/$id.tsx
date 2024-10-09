import { createFileRoute } from "@tanstack/react-router";

import {
  hentEksisterendeInntektsmeldinger,
  hentOpplysningerData,
} from "~/api/queries";
import { InntektsmeldingRootLayout } from "~/features/inntektsmelding/InntektsmeldingRootLayout";

export const Route = createFileRoute("/$id")({
  component: InntektsmeldingRootLayout,
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
