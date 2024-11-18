import { BodyShort, Loader } from "@navikt/ds-react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { hentOpplysningerDataOptions } from "~/features/refusjon-omsorgspenger-arbeidsgiver/api/queries";
import { RefusjonOmsorgspengerArbeidsgiverForm } from "~/features/refusjon-omsorgspenger-arbeidsgiver/RefusjonOmsorgspengerArbeidsgiverForm";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { queryClient } from "~/main";

export const Route = createFileRoute("/refusjon-omsorgspenger-arbeidsgiver")({
  component: () => (
    <RefusjonOmsorgspengerArbeidsgiverForm>
      <Outlet />
    </RefusjonOmsorgspengerArbeidsgiverForm>
  ),
  pendingComponent: () => (
    <RotLayout medHvitBoks={true} tittel="Inntektsmelding" undertittel={null}>
      <div className="my-6 flex flex-col items-center gap-4">
        <Loader className="mx-auto" size="2xlarge" />
        <BodyShort className="text-center">Henter opplysninger…</BodyShort>
      </div>
    </RotLayout>
  ),
  loader: async () => {
    const opplysninger = await queryClient.ensureQueryData(
      hentOpplysningerDataOptions,
    );

    return {
      opplysninger,
    };
  },
});
