import { createFileRoute } from "@tanstack/react-router";

import { HentOpplysninger } from "~/features/arbeidsgiverinitiert/steg/Steg0HentOpplysninger";

export const Route = createFileRoute("/opprett/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <HentOpplysninger />;
}
