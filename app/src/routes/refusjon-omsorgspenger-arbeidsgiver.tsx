import { BodyShort, Loader } from "@navikt/ds-react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { hentOpplysningerDataOptions } from "~/features/refusjon-omsorgspenger-arbeidsgiver/api/queries";
import { RefusjonOmsorgspengerArbeidsgiverRotLayout } from "~/features/refusjon-omsorgspenger-arbeidsgiver/RefusjonOmsorgspengerArbeidsgiverRotLayout";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { queryClient } from "~/main";

export const Route = createFileRoute("/refusjon-omsorgspenger-arbeidsgiver")({
  component: RefusjonOmsorgspengerArbeidsgiverRotLayout,
  pendingComponent: () => (
    <RotLayout medHvitBoks={true} tittel="Inntektsmelding" undertittel={null}>
      <div className="my-6 flex flex-col items-center gap-4">
        <Loader className="mx-auto" size="2xlarge" />
        <BodyShort className="text-center">Henter opplysninger…</BodyShort>
      </div>
    </RotLayout>
  ),
  loaderDeps: ({ search }) => {
    const ParamsSchema = z.object({
      organisasjonsnummer: z.number().min(100_000_000).max(999_999_999),
    });

    const parsedParams = ParamsSchema.safeParse(search);
    if (!parsedParams.success) {
      return {
        organisasjonsnummer: null,
      };
    }

    return {
      organisasjonsnummer: String(parsedParams.data.organisasjonsnummer),
    };
  },
  loader: async ({ deps }) => {
    const organisasjonsnummer = deps.organisasjonsnummer;
    if (!organisasjonsnummer) {
      throw new Error("Du må spesifisere et organisasjonsnummer");
    }

    const opplysninger = await queryClient.ensureQueryData(
      hentOpplysningerDataOptions(organisasjonsnummer),
    );

    return {
      opplysninger,
    };
  },
});
