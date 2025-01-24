import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg1 } from "~/features/refusjon-omsorgspenger-arbeidsgiver/Steg1Intro";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger-arbeidsgiver/$organisasjonsnummer/1-intro",
)({
  component: RefusjonOmsorgspengerArbeidsgiverSteg1,
});
