export function leggTilGenitiv(navn: string) {
  if (navn.endsWith("s") || navn.endsWith("x")) {
    return `${navn}'`;
  }

  return `${navn}s`;
}

export function capitalizeSetning(setning: string) {
  const oppdelteOrd = setning.split(" ");
  return oppdelteOrd.map((ord) => capitalize(ord)).join(" ");
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatKroner(kroner: number) {
  return Intl.NumberFormat("nb-no", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(kroner);
}

export function formatDatoLang(dato: Date) {
  return new Intl.DateTimeFormat("nb-no", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dato);
}

export function formatIsoDatostempel(dato: Date) {
  const år = dato.getFullYear();
  const måned = (dato.getMonth() + 1).toString().padStart(2, "0");
  const dag = dato.getDate().toString().padStart(2, "0");
  return `${år}-${måned}-${dag}`;
}

export function formatIdentitetsnummer(identitetsnummer: string) {
  if (!/^\d{11}$/.test(identitetsnummer)) {
    return identitetsnummer;
  }
  return `${identitetsnummer.slice(0, 6)} ${identitetsnummer.slice(6)}`;
}

export function formatYtelsesnavn(ytelsesnavn: string) {
  return ytelsesnavn.toLowerCase().replace("_", " ");
}

export function formatFødselsnummer(str: string) {
  if (str?.length !== 11) {
    return str;
  }
  return `${str.slice(0, 6)} ${str.slice(6)}`;
}
