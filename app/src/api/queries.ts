import { queryOptions } from "@tanstack/react-query";

import type { InntektsmeldingDialogDto } from "~/types/api-models";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

export function forespørselQueryOptions(forespørselUUID: string) {
  return queryOptions({
    queryKey: ["FORESPØRSEL", forespørselUUID],
    queryFn: async () => {
      const response = await fetch(
        `${SERVER_URL}/imdialog/grunnlag?foresporselUuid=${forespørselUUID}`,
        {
          headers: {
            "nav-consumer-id": "ft-inntektsmelding-frontend", // TODO: Kan fjernes når backend har skrudd på auth
          },
        },
      );
      if (response.status === 404) {
        throw new Error("Forespørsel ikke funnet");
      }
      if (!response.ok) {
        throw new Error("Kunne ikke hente forespørsel");
      }
      return (await response.json()) as InntektsmeldingDialogDto;
    },
  });
}
