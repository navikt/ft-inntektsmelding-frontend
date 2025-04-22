import {
  createFileRoute,
  redirect,
  useParams,
  useSearch,
} from "@tanstack/react-router";

export const Route = createFileRoute(
  "/refusjon-omsorgspenger/$organisasjonsnummer/",
)({
  component: () => {
    const { id } = useSearch({
      from: "/refusjon-omsorgspenger/$organisasjonsnummer",
    });

    const { organisasjonsnummer } = useParams({
      from: "/refusjon-omsorgspenger/$organisasjonsnummer",
    });

    if (id) {
      return redirect({
        to: "/refusjon-omsorgspenger/$organisasjonsnummer/vis",
        search: { id },
        params: {
          organisasjonsnummer,
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
