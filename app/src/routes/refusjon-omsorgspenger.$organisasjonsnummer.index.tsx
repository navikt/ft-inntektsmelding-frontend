import { createFileRoute, redirect, useParams } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer/",
)({
  component: () => {
    const { organisasjonsnummer, id } = useParams({
      from: "/refusjon-omsorgspenger/$organisasjonsnummer/$id",
    });

    if (id) {
      return redirect({
        to: "/refusjon-omsorgspenger/$organisasjonsnummer/$id",
        params: {
          organisasjonsnummer,
          id,
        },
      });
    }
    return redirect({
      to: "/refusjon-omsorgspenger/$organisasjonsnummer/1-intro",
      params: {
        organisasjonsnummer,
      },
    });
  },
});
