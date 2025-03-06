import { idnr } from "@navikt/fnrvalidator";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { logDev } from "~/utils";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

const ArbeidstakerOppslagDtoSchema = z.object({
  personinformasjon: z.object({
    fornavn: z.string(),
    mellomnavn: z.string().optional(),
    etternavn: z.string(),
    fødselsnummer: z.string(),
    aktørId: z.string(),
  }),
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

export const hentArbeidstakerOptions = (fødselsnummer: string) => {
  return queryOptions<
    ArbeidstakerOppslagDto,
    ArbeidstakerOppslagFeil,
    ArbeidstakerOppslagDto,
    ["arbeidstaker-oppslag", string]
  >({
    queryKey: ["arbeidstaker-oppslag", fødselsnummer],
    queryFn: ({ queryKey }) => hentArbeidstaker(queryKey[1]),
    enabled: idnr(fødselsnummer).status === "valid",
    staleTime: Infinity,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

const hentArbeidstaker = async (fødselsnummer: string) => {
  const response = await fetch(
    `${SERVER_URL}/refusjon-omsorgsdager/arbeidstaker`,
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

const InnloggetBrukerDtoSchema = z.object({
  fornavn: z.string().optional(),
  mellomnavn: z.string().optional(),
  etternavn: z.string().optional(),
  telefon: z.string().optional(),
  organisasjonsnummer: z.string().optional(),
  organisasjonsnavn: z.string().optional(),
});
export type InnloggetBrukerDto = z.infer<typeof InnloggetBrukerDtoSchema>;

type InnloggetBrukerFeil = { feilkode: "uventet respons" };

export const hentInnloggetBrukerDataOptions = (organisasjonsnummer: string) =>
  queryOptions<
    InnloggetBrukerDto,
    InnloggetBrukerFeil,
    InnloggetBrukerDto,
    ["refusjon-omsorgspenger-innlogget-bruker", string]
  >({
    queryKey: ["refusjon-omsorgspenger-innlogget-bruker", organisasjonsnummer],
    queryFn: ({ queryKey }) => hentInnloggetBrukerData(queryKey[1]),
  });

const hentInnloggetBrukerData = async (organisasjonsnummer: string) => {
  const response = await fetch(
    `${SERVER_URL}/refusjon-omsorgsdager/innlogget-bruker`,
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

  const parsedResponse = InnloggetBrukerDtoSchema.safeParse(json);
  if (!parsedResponse.success) {
    logDev(
      "error",
      "Mottok en uventet respons fra serveren",
      parsedResponse.error,
    );
    throw { feilkode: "uventet respons" } satisfies InnloggetBrukerFeil;
  }

  return parsedResponse.data;
};

const InntektsopplysningerDtoSchema = z.object({
  gjennomsnittLønn: z.number().optional(),
  månedsinntekter: z.array(
    z.object({
      fom: z.string(),
      tom: z.string(),
      beløp: z.number().optional(),
      status: z.enum([
        "NEDETID_AINNTEKT",
        "BRUKT_I_GJENNOMSNITT",
        "IKKE_RAPPORTERT_MEN_BRUKT_I_GJENNOMSNITT",
        "IKKE_RAPPORTERT_RAPPORTERINGSFRIST_IKKE_PASSERT",
      ]),
    }),
  ),
});
export type InntektsopplysningerDto = z.infer<
  typeof InntektsopplysningerDtoSchema
>;

type HentInntektsopplysningerArgs = {
  fødselsnummer: string;
  skjæringstidspunkt: string;
  organisasjonsnummer: string;
};
const hentInntektsopplysninger = async (args: HentInntektsopplysningerArgs) => {
  const response = await fetch(
    `${SERVER_URL}/refusjon-omsorgsdager/inntektsopplysninger`,
    {
      method: "POST",
      body: JSON.stringify(args),
      headers: { "Content-Type": "application/json" },
    },
  );

  const json = await response.json();
  const parsedJson = InntektsopplysningerDtoSchema.safeParse(json);
  if (!parsedJson.success) {
    logDev("error", parsedJson.error);
    throw new Error("Responsen fra serveren matchet ikke forventet format");
  }
  return parsedJson.data;
};

export const hentInntektsopplysningerOptions = (
  args: HentInntektsopplysningerArgs,
) => {
  return queryOptions<
    InntektsopplysningerDto,
    Error,
    InntektsopplysningerDto,
    [
      "refusjon-omsorgspenger-inntektsopplysninger",
      HentInntektsopplysningerArgs,
    ]
  >({
    queryKey: ["refusjon-omsorgspenger-inntektsopplysninger", args],
    queryFn: () => hentInntektsopplysninger(args),
  });
};
