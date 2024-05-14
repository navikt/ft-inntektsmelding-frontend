import { queryOptions } from "@tanstack/react-query";

import type { OrganisasjonInfoDto, PersonInfoDto } from "~/types/api-models.ts";

const FT_INNTEKTSMELDING_BACKEND_URL =
  "/server/api/ftinntektsmelding/api/imdialog";

export function arbeidsgiverQueryOptions(aktørId: string, ytelse: string) {
  return queryOptions({
    queryKey: ["ARBEIDSGIVER", aktørId, ytelse],
    queryFn: async () => {
      const response = await fetch(
        `${FT_INNTEKTSMELDING_BACKEND_URL}/personinfo?aktorId=${aktørId}&ytelse=${ytelse}`,
      );
      return (await response.json()) as PersonInfoDto;
    },
  });
}

export function organisasjonQueryOptions(organisasjonsnummer: string) {
  return queryOptions({
    queryKey: ["ORGANISASJON", organisasjonsnummer],
    queryFn: async () => {
      const response = await fetch(
        `${FT_INNTEKTSMELDING_BACKEND_URL}/organisasjon?organisasjonsnummer=${organisasjonsnummer}`,
      );
      return (await response.json()) as OrganisasjonInfoDto;
    },
  });
}