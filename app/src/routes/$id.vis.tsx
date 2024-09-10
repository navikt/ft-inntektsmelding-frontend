import { createFileRoute } from "@tanstack/react-router";

import { VisInntektsmelding } from "~/views/vis/VisInntektsmelding.tsx";

export const Route = createFileRoute("/$id/vis")({
  component: VisInntektsmelding,
});
