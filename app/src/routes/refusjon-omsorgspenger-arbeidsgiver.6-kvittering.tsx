import { createFileRoute } from "@tanstack/react-router";

import { Steg6Kvittering } from "~/features/refusjon-omsorgspenger-arbeidsgiver/Steg6Kvittering";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger-arbeidsgiver/6-kvittering",
)({
  component: Steg6Kvittering,
});
