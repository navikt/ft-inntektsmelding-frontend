import { queryOptions } from "@tanstack/react-query";

import type { OrganisasjonInfoDto, PersonInfoDto } from "~/types/api-models.ts";

const FT_INNTEKTSMELDING_BACKEND_URL = `/server/api/imdialog`;

export function personinfoQueryOptions(aktørId: string, ytelse: string) {
  return queryOptions({
    queryKey: ["PERSONINFO", aktørId, ytelse],
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
        {
          headers: {
            "nav-consumer-id": "ft-inntektsmelding-frontend", // TODO: dobbeltsjekk hva denne headeren burde være
          },
        },
      );
      return (await response.json()) as OrganisasjonInfoDto;
    },
  });
}
