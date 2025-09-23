import { createFileRoute } from "@tanstack/react-router";

import { HentOpplysninger } from "~/features/arbeidsgiverinitiert/HentOpplysninger.tsx";

export const Route = createFileRoute("/agi/opprett/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HentOpplysninger />;
}
