import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { logDev } from "~/utils";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

const PersondataDtoSchema = z.object({
  navn: z.string(),
  fødselsnummer: z.string(),
  arbeidsforhold: z.array(
    z.object({
      navn: z.string(),
      underenhetId: z.string(),
    }),
  ),
});
export type PersondataDto = z.infer<typeof PersondataDtoSchema>;

export type PersondataFeil =
  | { feilkode: "fant ingen personer" }
  | { feilkode: "generell feil" } // 5xx respons fra serveren
  | { feilkode: "uventet respons" } // Zod-validering feilet
  | Error; // Programmeringsfeil

export const slåOppPersondataOptions = (fødselsnummer: string) => {
  return queryOptions<
    PersondataDto,
    PersondataFeil,
    PersondataDto,
    ["persondata", string]
  >({
    queryKey: ["persondata", fødselsnummer],
    queryFn: ({ queryKey }) => slåOppPersondata(queryKey[1]),
    enabled: fødselsnummer.length === 11,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

const slåOppPersondata = async (fødselsnummer: string) => {
  const response = await fetch(
    `${SERVER_URL}/refusjon-omsorgspenger-arbeidsgiver/persondata`,
    {
      method: "POST",
      body: JSON.stringify({ fødselsnummer }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  const json = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      throw { feilkode: "fant ingen personer" } satisfies PersondataFeil;
    } else {
      logDev("error", "Persondata-oppslag feilet", json);
      throw { feilkode: "generell feil" } satisfies PersondataFeil;
    }
  }

  const parsedResponse = PersondataDtoSchema.safeParse(json);
  if (!parsedResponse.success) {
    logDev(
      "error",
      "Mottok en uventet respons fra serveren",
      parsedResponse.error,
    );
    throw { feilkode: "uventet respons" } satisfies PersondataFeil;
  }
  return parsedResponse.data;
};
