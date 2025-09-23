import { createFileRoute, useSearch } from "@tanstack/react-router";
import { z } from "zod";

import { InntektsmeldingRootLayoutComponent } from "~/features/inntektsmelding/InntektsmeldingRootLayout";
import { YtelsetypeSchema } from "~/types/api-models";

export const ARBEIDSGIVER_INITERT_ID = "agi";

const agiSearchParams = z.object({
  ytelseType: YtelsetypeSchema,
});

export const Route = createFileRoute("/opprett")({
  component: () => {
    const { ytelseType } = useSearch({ from: "/opprett" });
    return (
      <InntektsmeldingRootLayoutComponent
        skjemaId={ARBEIDSGIVER_INITERT_ID}
        ytelse={ytelseType}
      />
    );
  },

  validateSearch: (search) => agiSearchParams.parse(search),
});
