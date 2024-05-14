import { queryOptions } from "@tanstack/react-query";

import type { PersonInfoDto } from "~/types/api-models.ts";

const FT_INNTEKTSMELDING_BACKEND_URL =
  "/server/api/ftinntektsmelding/api/imdialog";

export function arbeidsgiverQueryOptions(fnr: string, ytelse: string) {
  return queryOptions({
    queryKey: ["AG", fnr, ytelse],
    queryFn: async () => {
      const response = await fetch(
        `${FT_INNTEKTSMELDING_BACKEND_URL}/personinfo?aktorId=${fnr}&ytelse=${ytelse}`,
      );
      return (await response.json()) as PersonInfoDto;
    },
  });
}
