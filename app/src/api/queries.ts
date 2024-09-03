import { z } from "zod";

import { navnMedStorBokstav } from "~/utils.ts";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

export async function hentOpplysningerData(uuid: string) {
  const response = await fetch(
    `${SERVER_URL}/imdialog/grunnlag?foresporselUuid=${uuid}`,
  );
  if (response.status === 404) {
    throw new Error("Forespørsel ikke funnet");
  }
  if (!response.ok) {
    throw new Error("Kunne ikke hente forespørsel");
  }
  const json = await response.json();
  const parsedJson = opplysningerSchema.safeParse(json);

  if (!parsedJson.success) {
    // TODO: Har med en error-logger her, bør fjernes før vi går i prod
    // eslint-disable-next-line no-console
    console.error(parsedJson.error);
    throw new Error("Responsen fra serveren matchet ikke forventet format");
  }
  return parsedJson.data;
}

const opplysningerSchema = z.object({
  person: z.object({
    aktørId: z.string(),
    fødselsnummer: z.string(),
    fornavn: z.string().transform(navnMedStorBokstav),
    mellomnavn: z
      .string()
      .optional()
      .transform((mellomnavn) => navnMedStorBokstav(mellomnavn || "")),
    etternavn: z.string().transform(navnMedStorBokstav),
  }),
  innsender: z.object({
    fornavn: z.string(),
    mellomnavn: z.string().optional(),
    etternavn: z.string(),
    telefon: z.string().optional(),
  }),
  arbeidsgiver: z.object({
    organisasjonNavn: z.string(),
    organisasjonNummer: z.string(),
  }),
  inntekter: z
    .array(
      z.object({
        fom: z.string(),
        tom: z.string(),
        beløp: z.number(),
        arbeidsgiverIdent: z.string(),
      }),
    )
    .optional(),
  startdatoPermisjon: z.string(),
  ytelse: z.enum([
    "FORELDREPENGER",
    "SVANGERSKAPSPENGER",
    "PLEIEPENGER_SYKT_BARN",
    "PLEIEPENGER_I_LIVETS_SLUTTFASE",
    "OPPLÆRINGSPENGER",
    "OMSORGSPENGER",
  ]),
});

export type OpplysningerDto = z.infer<typeof opplysningerSchema>;
