import { createFileRoute } from "@tanstack/react-router";

import { Steg4KvitteringAGI } from "~/features/arbeidsgiverinitiert/Steg4KvitteringAGI.tsx";

export const Route = createFileRoute("/agi/$id/kvittering")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Steg4KvitteringAGI />;
}
