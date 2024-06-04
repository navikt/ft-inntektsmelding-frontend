import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ny/$id/oppsummering")({
  component: () => <div>Hello /ny/$id/oppsummering!</div>,
});
