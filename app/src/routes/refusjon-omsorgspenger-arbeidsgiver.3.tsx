import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg3 } from "~/features/refusjon-omsorgspenger-arbeidsgiver/Steg3Omsorgsdager";

export const Route = createFileRoute("/refusjon-omsorgspenger-arbeidsgiver/3")({
  component: RefusjonOmsorgspengerArbeidsgiverSteg3,
});
