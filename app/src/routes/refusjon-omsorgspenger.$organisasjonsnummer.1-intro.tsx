import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg1 } from "~/features/refusjon-omsorgspenger/Steg1Intro";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer/1-intro",
)({
  component: RefusjonOmsorgspengerArbeidsgiverSteg1,
});
