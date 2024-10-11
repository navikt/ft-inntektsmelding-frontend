import { BodyShort, Loader } from "@navikt/ds-react";
import { createFileRoute } from "@tanstack/react-router";

import {
  hentEksisterendeInntektsmeldinger,
  hentOpplysningerData,
} from "~/api/queries";
import { InntektsmeldingRootLayout } from "~/features/inntektsmelding/InntektsmeldingRootLayout";
import { RotLayout } from "~/features/rot-layout/RotLayout";

export const Route = createFileRoute("/$id")({
  component: InntektsmeldingRootLayout,
  pendingComponent: () => (
    <RotLayout medHvitBoks={true} tittel="Inntektsmelding" undertittel={null}>
      <div className="my-6 flex flex-col items-center gap-4">
        <Loader className="mx-auto" size="2xlarge" />
        <BodyShort className="text-center">Henter opplysninger…</BodyShort>
      </div>
    </RotLayout>
  ),
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
