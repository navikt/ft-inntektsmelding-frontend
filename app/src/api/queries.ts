import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { InntektsmeldingSkjemaStateValid } from "~/features/InntektsmeldingSkjemaState";
import { InntektsmeldingResponseDtoSchema } from "~/types/api-models";
import { logDev, navnMedStorBokstav } from "~/utils.ts";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

export const hentInntektsmeldingPdfUrl = (inntektsmeldingId: string) =>
  `${SERVER_URL}/inntektsmeldinger/${inntektsmeldingId}/pdf`;

export function hentGrunnbeløpOptions() {
  return queryOptions({
    queryKey: ["GRUNNBELØP"],
    queryFn: hentGrunnbeløp,
    initialData: Infinity,
  });
}

async function hentGrunnbeløp() {
  try {
    const response = await fetch("https://g.nav.no/api/v1/grunnbel%C3%B8p");
    if (!response.ok) {
      return Infinity;
    }

    const json = await response.json();
    const parsedJson = grunnbeløpSchema.safeParse(json);

    if (!parsedJson.success) {
      return Infinity;
    }
    return parsedJson.data.grunnbeløp;
  } catch {
    return Infinity;
  }
}

const grunnbeløpSchema = z.object({
  dato: z.string(),
  grunnbeløp: z.number(),
  grunnbeløpPerMåned: z.number(),
  gjennomsnittPerÅr: z.number(),
  omregningsfaktor: z.number(),
  virkningstidspunktForMinsteinntekt: z.string(),
});

export async function hentEksisterendeInntektsmeldinger(uuid: string) {
  const response = await fetch(
    `${SERVER_URL}/imdialog/inntektsmeldinger?foresporselUuid=${uuid}`,
  );

  if (response.status === 404) {
    throw new Error("Forespørsel ikke funnet");
  }

  if (!response.ok) {
    throw new Error("Kunne ikke hente forespørsel");
  }
  const json = await response.json();
  const parsedJson = z.array(InntektsmeldingResponseDtoSchema).safeParse(json);

  if (!parsedJson.success) {
    logDev("error", parsedJson.error);

    throw new Error("Responsen fra serveren matchet ikke forventet format");
  }

  return parsedJson.data.map(
    (inntektsmelding) =>
      ({
        kontaktperson: inntektsmelding.kontaktperson,
        refusjonsbeløpPerMåned: inntektsmelding.refusjon ?? 0,
        refusjonsendringer: (inntektsmelding.refusjonsendringer ?? []).map(
          (periode) => ({
            ...periode,
            fom: new Date(periode.fom),
          }),
        ),
        endringIRefusjon: (inntektsmelding.refusjonsendringer ?? []).length > 0,
        naturalytelserSomMistes:
          inntektsmelding.bortfaltNaturalytelsePerioder?.map((periode) => ({
            navn: periode.naturalytelsetype,
            fom: new Date(periode.fom),
            beløp: periode.beløp,
            inkluderTom: periode.tom !== undefined,
            tom: periode.tom ? new Date(periode.tom) : undefined,
          })) ?? [],
        inntektEndringsÅrsak: undefined, // TODO: Send inn når BE har støtte for det
        inntekt: inntektsmelding.inntekt,
        skalRefunderes: Boolean(inntektsmelding.refusjon),
        misterNaturalytelser:
          (inntektsmelding.bortfaltNaturalytelsePerioder?.length ?? 0) > 0,
        opprettetTidspunkt: new Date(inntektsmelding.opprettetTidspunkt),
      }) satisfies InntektsmeldingSkjemaStateValid,
  );
}

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
    logDev("error", parsedJson.error);
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
