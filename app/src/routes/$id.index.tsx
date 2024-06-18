import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$id/")({
  loader: () => {
    throw redirect({
      from: "/$id",
      to: "/$id/dine-opplysninger",
      replace: true,
    });
  },
});
