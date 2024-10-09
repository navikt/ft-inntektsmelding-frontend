import { createFileRoute } from "@tanstack/react-router";

import { VisInntektsmelding } from "~/features/inntektsmelding/VisInntektsmelding";

export const Route = createFileRoute("/$id/vis")({
  component: VisInntektsmelding,
});
