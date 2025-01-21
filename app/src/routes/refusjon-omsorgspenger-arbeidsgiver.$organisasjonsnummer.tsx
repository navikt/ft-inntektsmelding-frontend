import { BodyShort, Loader } from "@navikt/ds-react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { hentOpplysningerDataOptions } from "~/features/refusjon-omsorgspenger-arbeidsgiver/api/queries";
import { RefusjonOmsorgspengerArbeidsgiverRotLayout } from "~/features/refusjon-omsorgspenger-arbeidsgiver/RefusjonOmsorgspengerArbeidsgiverRotLayout";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { queryClient } from "~/main";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer",
)({
  component: RefusjonOmsorgspengerArbeidsgiverRotLayout,
  pendingComponent: () => (
    <RotLayout medHvitBoks={true} tittel="Inntektsmelding" undertittel={null}>
      <div className="my-6 flex flex-col items-center gap-4">
        <Loader className="mx-auto" size="2xlarge" />
        <BodyShort className="text-center">Henter opplysninger…</BodyShort>
      </div>
    </RotLayout>
  ),

  loader: async ({ params }) => {
    const organisasjonsnummerSchema = z
      .string()
      .regex(/^\d+$/, "Organisasjonsnummer må bestå av kun tall")
      .refine((val) => {
        const num = Number(val);
        return num >= 100_000_000 && num <= 999_999_999;
      }, "Ugyldig organisasjonsnummer");

    const parsed = organisasjonsnummerSchema.safeParse(
      params.organisasjonsnummer,
    );
    if (!parsed.success) {
      throw new Error("Ugyldig organisasjonsnummer");
    }

    const organisasjonsnummer = parsed.data;

    const opplysninger = await queryClient.ensureQueryData(
      hentOpplysningerDataOptions(organisasjonsnummer),
    );

    return { opplysninger };
  },
});
