import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { InntektsmeldingRootLayoutComponent } from "~/features/inntektsmelding/InntektsmeldingRootLayout.tsx";
import { YtelsetypeSchema } from "~/types/api-models.ts";

const agiSearchParams = z.object({
  ytelseType: YtelsetypeSchema,
});

/**
 * Rute for AGI - arbeidsgiverinitiert inntektsmelding.
 */
export const Route = createFileRoute("/opprett")({
  component: RouteComponent,
  validateSearch: (search) => agiSearchParams.parse(search),
});

function RouteComponent() {
  const { ytelseType } = Route.useSearch();

  return (
    <InntektsmeldingRootLayoutComponent skjemaId="agi" ytelse={ytelseType} />
  );
}
