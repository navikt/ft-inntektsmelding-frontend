import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg4 } from "~/features/refusjon-omsorgspenger-arbeidsgiver/Steg4Refusjon";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/4-refusjon",
)({
  component: RefusjonOmsorgspengerArbeidsgiverSteg4,
});
