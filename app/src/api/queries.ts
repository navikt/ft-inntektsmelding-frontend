import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { InntektsmeldingSkjemaStateValid } from "~/features/InntektsmeldingSkjemaState";
import {
  grunnbeløpSchema,
  InntektsmeldingResponseDtoSchema,
  opplysningerSchema,
  SendInntektsmeldingResponseDto,
} from "~/types/api-models";
import { logDev } from "~/utils.ts";

const SERVER_URL = `${import.meta.env.BASE_URL}/server/api`;

export const hentInntektsmeldingPdfUrl = (id: number) =>
  `${SERVER_URL}/imdialog/last-ned-pdf?id=${id}`;

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

  return parsedJson.data.map((im) =>
    mapInntektsmeldingResponseTilValidState(im),
  );
}

export function mapInntektsmeldingResponseTilValidState(
  inntektsmelding: SendInntektsmeldingResponseDto,
) {
  return {
    kontaktperson: inntektsmelding.kontaktperson,
    refusjonsbeløpPerMåned: inntektsmelding.refusjon ?? 0,
    refusjonsendringer: (inntektsmelding.refusjonsendringer ?? []).map(
      (periode) => ({
        ...periode,
        fom: periode.fom,
      }),
    ),
    naturalytelserSomMistes:
      inntektsmelding.bortfaltNaturalytelsePerioder?.map((periode) => ({
        navn: periode.naturalytelsetype,
        fom: periode.fom,
        beløp: periode.beløp,
        inkluderTom: periode.tom !== undefined,
        tom: periode.tom,
      })) ?? [],
    endringAvInntektÅrsaker: [], // TODO: Send inn når BE har støtte for det
    inntekt: inntektsmelding.inntekt,
    // TODO: denne ble stygg
    skalRefunderes:
      (inntektsmelding.refusjonsendringer ?? []).length > 0
        ? "JA_VARIERENDE_REFUSJON"
        : inntektsmelding.refusjon
          ? "JA_LIK_REFUSJON"
          : "NEI",
    misterNaturalytelser:
      (inntektsmelding.bortfaltNaturalytelsePerioder?.length ?? 0) > 0,
    opprettetTidspunkt: inntektsmelding.opprettetTidspunkt,
    id: inntektsmelding.id,
  } satisfies InntektsmeldingSkjemaStateValid;
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
