import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ny/$id/kvittering")({
  component: () => <div>Hello /ny/$id/kvittering!</div>,
});
