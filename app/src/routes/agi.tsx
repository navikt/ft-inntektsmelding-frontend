import { BodyShort, Loader } from "@navikt/ds-react";
import { createFileRoute } from "@tanstack/react-router";

import { hentOpplysningerData } from "~/api/queries";
import { InntektsmeldingRootAGI } from "~/features/inntektsmelding/InntektsmeldingRootLayout";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { OpplysningerDto } from "~/types/api-models";

export const Route = createFileRoute("/agi")({
  component: InntektsmeldingRootAGI,
  errorComponent: ({ error }) => {
    throw error;
  },
  pendingComponent: () => (
    <RotLayout medHvitBoks={true} tittel="Inntektsmelding" undertittel={null}>
      <div className="my-6 flex flex-col items-center gap-4">
        <Loader className="mx-auto" size="2xlarge" />
        <BodyShort className="text-center">Henter opplysninger…</BodyShort>
      </div>
    </RotLayout>
  ),
  loader: async () => {
    const opplysninger = await hentOpplysningerData("agi");

    return {
      opplysninger: opplysninger as OpplysningerDto,
      eksisterendeInntektsmeldinger: [],
    };
  },
});
