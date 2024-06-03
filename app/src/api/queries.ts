import { queryOptions } from "@tanstack/react-query";

import type {
  ForespørselEntitet,
  HentInntektRequestDto,
  MånedsinntektResponsDto,
  OrganisasjonInfoDto,
  PersonInfoDto,
  Ytelsetype,
} from "~/types/api-models.ts";

const FT_INNTEKTSMELDING_BACKEND_URL = `/server/api`;

export function personinfoQueryOptions(aktørId: string, ytelse: Ytelsetype) {
  return queryOptions({
    queryKey: ["PERSONINFO", aktørId, ytelse],
    queryFn: async () => {
      const response = await fetch(
        `${FT_INNTEKTSMELDING_BACKEND_URL}/imdialog/personinfo?aktorId=${aktørId}&ytelse=${ytelse}`,
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
        `${FT_INNTEKTSMELDING_BACKEND_URL}/imdialog/organisasjon?organisasjonsnummer=${organisasjonsnummer}`,
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

export function forespørselQueryOptions(forespørselUUID: string) {
  return queryOptions({
    queryKey: ["FORESPØRSEL", forespørselUUID],
    queryFn: async () => {
      const response = await fetch(
        `${FT_INNTEKTSMELDING_BACKEND_URL}/foresporsel/${forespørselUUID}`,
      );
      return (await response.json()) as ForespørselEntitet;
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
        `${FT_INNTEKTSMELDING_BACKEND_URL}/imdialog/inntekt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hentInntektRequestDto),
        },
      );

      return (await response.json()) as MånedsinntektResponsDto[];
    },
    select: (data) =>
      data.sort(
        (a, b) => new Date(a.fom).getTime() - new Date(b.fom).getTime(),
      ),
  });
}
