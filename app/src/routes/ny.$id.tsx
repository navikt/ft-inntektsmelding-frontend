import { createFileRoute } from "@tanstack/react-router";

import { NyInntektsmelding } from "../views/ny-inntektsmelding/NyInntektsmelding";

export const Route = createFileRoute("/ny/$id")({
  component: NyInntektsmelding,
});
