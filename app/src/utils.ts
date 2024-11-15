import { z } from "zod";

import { mapInntektsmeldingResponseTilValidState } from "~/api/queries.ts";
import type { OpplysningerDto } from "~/types/api-models.ts";

export function leggTilGenitiv(navn?: string) {
  if (!navn) {
    return navn;
  }
  if (navn.endsWith("s") || navn.endsWith("x")) {
    return `${navn}'`;
  }

  return `${navn}s`;
}

export function lagFulltNavn({
  fornavn,
  mellomnavn,
  etternavn,
}: {
  fornavn?: string;
  mellomnavn?: string;
  etternavn?: string;
}) {
  return formatNavn([fornavn, mellomnavn, etternavn].filter(Boolean).join(" "));
}

export function formatNavn(navn?: string) {
  if (!navn) {
    return navn;
  }
  return navn
    .toLowerCase()
    .split(" ")
    .map((del) =>
      del
        .split("-")
        .map((delnavn) => capitalize(delnavn))
        .join("-"),
    )
    .join(" ");
}

export function formatTelefonnummer(telefonnummer: string): string {
  const tegn = telefonnummer.replaceAll(/\D/g, "");

  if (tegn.length !== 8) {
    return telefonnummer;
  }

  if (["4", "8", "9"].includes(tegn[0])) {
    return `${tegn.slice(0, 3)} ${tegn.slice(3, 5)} ${tegn.slice(5)}`;
  }

  return `${tegn.slice(0, 2)} ${tegn.slice(2, 4)} ${tegn.slice(4, 6)} ${tegn.slice(6)}`;
}

export function capitalizeSetning(setning?: string) {
  if (!setning) {
    return setning;
  }
  const oppdelteOrd = setning.split(" ");
  return oppdelteOrd.map((ord) => capitalize(ord)).join(" ");
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatKroner(kroner: number | string | undefined) {
  if (kroner === undefined) {
    return "";
  }

  const kronerSomTall = formatStrengTilTall(kroner);

  return Intl.NumberFormat("nb-no", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: kronerSomTall % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(kronerSomTall);
}

export function formatDatoLang(dato: Date) {
  return new Intl.DateTimeFormat("nb-no", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dato);
}

export function formatDatoKort(dato: Date) {
  return new Intl.DateTimeFormat("nb-no", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dato);
}

export function formatDatoTidKort(dato: Date) {
  return new Intl.DateTimeFormat("nb-no", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(dato)
    .replace(", ", " kl ");
}

export function formatIsoDatostempel(dato: Date) {
  const år = dato.getFullYear();
  const måned = (dato.getMonth() + 1).toString().padStart(2, "0");
  const dag = dato.getDate().toString().padStart(2, "0");
  return `${år}-${måned}-${dag}`;
}

export function formatFødselsnummer(fødselsnummer: string) {
  if (!/^\d{11}$/.test(fødselsnummer)) {
    return fødselsnummer;
  }
  return `${fødselsnummer.slice(0, 6)} ${fødselsnummer.slice(6)}`;
}

export function formatYtelsesnavn(ytelsesnavn: string, storForbokstav = false) {
  const formattert = ytelsesnavn.toLowerCase().replaceAll("_", " ");
  if (storForbokstav) {
    return capitalize(formattert);
  }
  return formattert;
}

type FormatStønadsnavnArgs = {
  ytelsesnavn: OpplysningerDto["ytelse"];
  form: "ubestemt" | "bestemt";
};
export function formatStønadsnavn({
  ytelsesnavn,
  form,
}: FormatStønadsnavnArgs) {
  const navn = STØNADSNAVN[ytelsesnavn];
  if (!navn) {
    return ytelsesnavn;
  }
  if (form === "bestemt") {
    return navn.replace("penger", "pengene");
  }
  return navn;
}
const STØNADSNAVN = {
  FORELDREPENGER: "foreldrepenger",
  SVANGERSKAPSPENGER: "svangerskapspenger",
  PLEIEPENGER_SYKT_BARN: "pleiepenger",
  PLEIEPENGER_NÆRSTÅENDE: "pleiepenger",
  OPPLÆRINGSPENGER: "opplæringspenger",
  OMSORGSPENGER: "omsorgspenger",
};

export const beløpSchema = z.union([z.string(), z.number()]);

export const isDev = import.meta.env.DEV;

export function logDev(
  level: "info" | "warn" | "error",
  ...message: unknown[]
) {
  if (isDev) {
    // eslint-disable-next-line no-console
    console[level](...message);
  }
}

export const formatStrengTilTall = (tall: string | number) => {
  // Norske desimaltall bruker komma, mens Number() krever punktum.
  const tallMedPunktumDesimaltegn = tall.toString().replace(",", ".");
  const tallMedRiktigMinusTegn = tallMedPunktumDesimaltegn.replace("−", "-");
  return Number(tallMedRiktigMinusTegn);
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[åæ]/g, "a")
    .replaceAll(/[öø]/g, "o")
    .replaceAll(/[^\d\sa-z-]/g, "")
    .replaceAll(/[\s-]+/g, "-");
}

export function finnSenesteInntektsmelding(
  inntektsmeldinger: ReturnType<
    typeof mapInntektsmeldingResponseTilValidState
  >[],
) {
  const medOpprettetTidspunkt = inntektsmeldinger.filter(
    (im) => !!im.opprettetTidspunkt,
  );
  const [sisteInntektsmelding] = medOpprettetTidspunkt.sort(
    (a, b) =>
      new Date(b.opprettetTidspunkt).getTime() -
      new Date(a.opprettetTidspunkt).getTime(),
  );

  return sisteInntektsmelding;
}

export function formatOppramsing(strenger: string[]) {
  const formatterer = new Intl.ListFormat("no", {
    style: "long",
    type: "conjunction",
  });
  return formatterer.format(strenger);
}
