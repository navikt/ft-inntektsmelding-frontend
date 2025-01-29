import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { logDev } from "~/utils";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

const ArbeidstakerOppslagDtoSchema = z.object({
  fornavn: z.string(),
  etternavn: z.string(),
  arbeidsforhold: z.array(
    z.object({
      organisasjonsnummer: z.string(),
      arbeidsforholdId: z.string(),
    }),
  ),
});
export type ArbeidstakerOppslagDto = z.infer<
  typeof ArbeidstakerOppslagDtoSchema
>;

export type ArbeidstakerOppslagFeil =
  | { feilkode: "fant ingen personer" }
  | { feilkode: "generell feil" } // 5xx respons fra serveren
  | { feilkode: "uventet respons" } // Zod-validering feilet
  | Error; // Programmeringsfeil

export const slåOppArbeidstakerOptions = (fødselsnummer: string) => {
  return queryOptions<
    ArbeidstakerOppslagDto,
    ArbeidstakerOppslagFeil,
    ArbeidstakerOppslagDto,
    ["arbeidstaker-oppslag", string]
  >({
    queryKey: ["arbeidstaker-oppslag", fødselsnummer],
    queryFn: ({ queryKey }) => slåOppArbeidstaker(queryKey[1]),
    enabled: fødselsnummer.length === 11,
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

const slåOppArbeidstaker = async (fødselsnummer: string) => {
  const response = await fetch(
    `${SERVER_URL}/refusjon-omsorgsdager-arbeidsgiver/arbeidstaker`,
    {
      method: "POST",
      body: JSON.stringify({
        fødselsnummer,
        ytelseType: "OMSORGSPENGER",
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  const json = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      throw {
        feilkode: "fant ingen personer",
      } satisfies ArbeidstakerOppslagFeil;
    } else {
      logDev("error", "Arbeidstaker-oppslag feilet", json);
      throw { feilkode: "generell feil" } satisfies ArbeidstakerOppslagFeil;
    }
  }

  const parsedResponse = ArbeidstakerOppslagDtoSchema.safeParse(json);
  if (!parsedResponse.success) {
    logDev(
      "error",
      "Mottok en uventet respons fra serveren",
      parsedResponse.error,
    );
    throw { feilkode: "uventet respons" } satisfies ArbeidstakerOppslagFeil;
  }
  return parsedResponse.data;
};

const OpplysningerDtoSchema = z.object({
  fornavn: z.string().optional(),
  mellomnavn: z.string().optional(),
  etternavn: z.string().optional(),
  telefon: z.string().optional(),
  organisasjonsnummer: z.string().optional(),
  organisasjonsnavn: z.string().optional(),
});
export type OpplysningerDto = z.infer<typeof OpplysningerDtoSchema>;

type OpplysningerFeil = { feilkode: "uventet respons" };

export const hentOpplysningerDataOptions = (organisasjonsnummer: string) =>
  queryOptions<
    OpplysningerDto,
    OpplysningerFeil,
    OpplysningerDto,
    ["refusjon-omsorgspenger-opplysninger", string]
  >({
    queryKey: ["refusjon-omsorgspenger-opplysninger", organisasjonsnummer],
    queryFn: ({ queryKey }) => hentOpplysningerData(queryKey[1]),
  });

const hentOpplysningerData = async (organisasjonsnummer: string) => {
  const response = await fetch(
    `${SERVER_URL}/refusjon-omsorgsdager-arbeidsgiver/innlogget-bruker`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organisasjonsnummer,
        ytelseType: "OMSORGSPENGER",
      }),
    },
  );

  const json = await response.json();

  const parsedResponse = OpplysningerDtoSchema.safeParse(json);
  if (!parsedResponse.success) {
    logDev(
      "error",
      "Mottok en uventet respons fra serveren",
      parsedResponse.error,
    );
    throw { feilkode: "uventet respons" } satisfies OpplysningerFeil;
  }

  return parsedResponse.data;
};
