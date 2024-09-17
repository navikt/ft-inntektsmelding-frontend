import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg5 } from "~/features/refusjon-omsorgspenger-arbeidsgiver/Steg5";

export const Route = createFileRoute("/refusjon-omsorgspenger-arbeidsgiver/5")({
  component: RefusjonOmsorgspengerArbeidsgiverSteg5,
});
