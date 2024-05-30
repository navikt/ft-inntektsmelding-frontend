import { requireEnvironment } from "@navikt/backend-for-frontend-utils";
import { queryOptions } from "@tanstack/react-query";

import type {
  HentInntektRequestDto,
  MånedsinntektResponsDto,
  OrganisasjonInfoDto,
  PersonInfoDto,
  Ytelsetype,
} from "~/types/api-models.ts";

const FT_INNTEKTSMELDING_BACKEND_URL = `/server/api/${requireEnvironment("APP_PATH_PREFIX")}/api/imdialog`;

export function personinfoQueryOptions(aktørId: string, ytelse: Ytelsetype) {
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
      );
      return (await response.json()) as OrganisasjonInfoDto;
    },
  });
}

export function inntektQueryOptions(
  hentInntektRequestDto: HentInntektRequestDto,
) {
  return queryOptions({
    queryKey: ["INNTEKT", hentInntektRequestDto],
    queryFn: async () => {
      const response = await fetch(
        `${FT_INNTEKTSMELDING_BACKEND_URL}/inntekt`,
        {
          method: "POST",
          body: JSON.stringify(hentInntektRequestDto),
        },
      );

      return (await response.json()) as MånedsinntektResponsDto;
    },
  });
}
