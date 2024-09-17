import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg2 } from "~/features/refusjon-omsorgspenger-arbeidsgiver/Steg2";

export const Route = createFileRoute("/refusjon-omsorgspenger-arbeidsgiver/2")({
  component: RefusjonOmsorgspengerArbeidsgiverSteg2,
});
