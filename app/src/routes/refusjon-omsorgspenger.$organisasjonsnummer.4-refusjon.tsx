import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg4 } from "~/features/refusjon-omsorgspenger/steg/Steg4Refusjon";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer/4-refusjon",
)({
  component: RefusjonOmsorgspengerArbeidsgiverSteg4,
});
