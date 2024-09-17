import { createFileRoute } from "@tanstack/react-router";

import { RefusjonOmsorgspengerArbeidsgiverSteg1 } from "~/features/refusjon-omsorgspenger-arbeidsgiver/Steg1";

export const Route = createFileRoute("/refusjon-omsorgspenger-arbeidsgiver/1")({
  component: RefusjonOmsorgspengerArbeidsgiverSteg1,
});
