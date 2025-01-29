import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg3 } from "~/features/refusjon-omsorgspenger/Steg3Omsorgsdager";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer/3-omsorgsdager",
)({
  component: RefusjonOmsorgspengerArbeidsgiverSteg3,
});
