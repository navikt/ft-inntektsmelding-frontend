import { createFileRoute } from "@tanstack/react-router";

import { VisInntektsmelding } from "~/features/arbeidsgiverinitiert/VisInnsendtInntektsmeldingAGI";

export const Route = createFileRoute("/agi/$id/vis")({
  component: VisInntektsmelding,
});
