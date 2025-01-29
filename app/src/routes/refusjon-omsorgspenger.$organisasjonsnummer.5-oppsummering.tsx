import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg5 } from "~/features/refusjon-omsorgspenger/Steg5Oppsummering";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer/5-oppsummering",
)({
  component: RefusjonOmsorgspengerArbeidsgiverSteg5,
});
