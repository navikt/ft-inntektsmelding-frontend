import { createFileRoute } from "@tanstack/react-router";

import { Kvittering } from "~/views/kvittering/Kvittering";

export const Route = createFileRoute("/$id/kvittering")({
  component: Kvittering,
});
