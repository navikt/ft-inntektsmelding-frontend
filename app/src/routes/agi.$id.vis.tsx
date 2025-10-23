import { createFileRoute } from "@tanstack/react-router";

import { VisInntektsmelding } from "~/features/arbeidsgiverinitiert/visningskomponenter/VisInnsendtInntektsmeldingAGI";

export const Route = createFileRoute("/agi/$id/vis")({
  component: VisInntektsmelding,
});
