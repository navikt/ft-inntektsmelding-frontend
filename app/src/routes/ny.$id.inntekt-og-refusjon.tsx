import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ny/$id/inntekt-og-refusjon")({
  component: () => <div>Hello /ny/$id/inntektsmelding!</div>,
});
