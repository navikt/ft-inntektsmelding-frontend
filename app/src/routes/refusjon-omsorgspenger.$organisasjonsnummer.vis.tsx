import { createFileRoute } from "@tanstack/react-router";

import { VisInnsendtRefusjonskrav } from "~/features/refusjon-omsorgspenger/VisInnsendtRefusjonskrav";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer/vis",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <VisInnsendtRefusjonskrav />;
}
