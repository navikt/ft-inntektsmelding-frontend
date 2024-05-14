import { queryOptions, useQuery } from "@tanstack/react-query";

const FT_INNTEKTSMELDING_BACKEND_URL =
  "/server/api/ftinntektsmelding/api/imdialog";

export function useAG(fnr: string, ytelse: string) {
  return useQuery({
    queryKey: ["AG", fnr, ytelse],
    queryFn: () =>
      fetch(
        `${FT_INNTEKTSMELDING_BACKEND_URL}/personinfo?aktorId=${fnr}&ytelse=${ytelse}`,
      ),
  });
}
