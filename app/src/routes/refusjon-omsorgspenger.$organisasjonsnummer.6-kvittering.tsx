import { createFileRoute } from "@tanstack/react-router";

import { Steg6Kvittering } from "~/features/refusjon-omsorgspenger/steg/Steg6Kvittering";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer/6-kvittering",
)({
  component: Steg6Kvittering,
});
