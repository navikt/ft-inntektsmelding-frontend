import { createFileRoute } from "@tanstack/react-router";

import { EndreInntektsmelding } from "~/views/endre-inntektsmelding/EndreInntektsmelding";

export const Route = createFileRoute("/endre/$id")({
  component: EndreInntektsmelding,
});
