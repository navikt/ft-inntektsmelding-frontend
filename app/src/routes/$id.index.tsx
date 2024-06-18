import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$id/")({
  component: () => null,
  loader: () => {
    throw redirect({ from: "/$id", to: "/$id/dine-opplysninger" });
  },
});
