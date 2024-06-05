export function leggTilGenitiv(navn: string) {
  if (navn.endsWith("s") || navn.endsWith("x")) {
    return `${navn}'`;
  }

  return `${navn}s`;
}

export function capitalizeSetning(setning: string) {
  const oppdelteOrd = setning.split(" ");
  return oppdelteOrd
    .map((ord) => ord.charAt(0).toUpperCase() + ord.slice(1).toLowerCase())
    .join(" ");
}

export function formatKroner(kroner: number) {
  return Intl.NumberFormat("nb-no", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(kroner);
}
