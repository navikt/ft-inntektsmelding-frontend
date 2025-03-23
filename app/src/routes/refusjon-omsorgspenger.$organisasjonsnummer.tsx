import { BodyShort, Loader } from "@navikt/ds-react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SERVER_URL } from "~/api/mutations";
import { hentOpplysningerData } from "~/api/queries";
import { RefusjonOmsorgspengerResponseDtoSchema } from "~/features/refusjon-omsorgspenger/api/mutations";
import { hentInnloggetBrukerDataOptions } from "~/features/refusjon-omsorgspenger/api/queries";
import { RefusjonOmsorgspengerArbeidsgiverRotLayout } from "~/features/refusjon-omsorgspenger/RefusjonOmsorgspengerArbeidsgiverRotLayout";
import { RotLayout } from "~/features/rot-layout/RotLayout";
import { queryClient } from "~/main";
import { logDev } from "~/utils";

import { ARBEIDSGIVER_INITERT_ID } from "./opprett";

enum FEILKODER {
  OPPGAVE_ER_UTGÅTT = "OPPGAVE_ER_UTGÅTT",
}

export async function hentEksisterendeInntektsmeldinger(uuid: string) {
  if (uuid === ARBEIDSGIVER_INITERT_ID) {
    return [];
  }
  const response = await fetch(
    `${SERVER_URL}/imdialog/inntektsmeldinger?foresporselUuid=${uuid}`,
  );

  if (response.status === 404) {
    throw new Error("Forespørsel ikke funnet");
  }

  if (!response.ok) {
    throw new Error(
      "Kunne ikke hente eksisterende inntektsmeldinger for forespørsel",
    );
  }
  const json = await response.json();
  const parsedJson = z
    .array(RefusjonOmsorgspengerResponseDtoSchema)
    .safeParse(json);

  if (!parsedJson.success) {
    logDev(
      "error",
      "Responsen fra serveren matchet ikke forventet format",
      parsedJson.error,
    );
  }

  return parsedJson.data;
}

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer",
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
  validateSearch: (search) => search as { id?: string },
  loaderDeps: ({ search: { id } }) => ({ id }),
  loader: async ({ params, deps }) => {
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

    const innloggetBruker = await queryClient.ensureQueryData(
      hentInnloggetBrukerDataOptions(organisasjonsnummer),
    );

    if (deps.id) {
      const [opplysninger, eksisterendeInntektsmeldinger] = await Promise.all([
        hentOpplysningerData(deps.id),
        hentEksisterendeInntektsmeldinger(deps.id),
      ]);

      if (
        opplysninger.forespørselStatus === "UTGÅTT" &&
        eksisterendeInntektsmeldinger?.length === 0
      ) {
        throw new Error(FEILKODER.OPPGAVE_ER_UTGÅTT);
      }
      return { innloggetBruker, eksisterendeInntektsmeldinger, opplysninger };
    }
    return { innloggetBruker };
  },
});
