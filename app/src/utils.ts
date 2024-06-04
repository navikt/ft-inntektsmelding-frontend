// TODO: Finnes sikkert noe bedre alternativ?
export function leggTilGenitiv(navn: string) {
  if (navn.endsWith("s") || navn.endsWith("x")) {
    return `${navn}'`;
  }

  return `${navn}s`;
}

export function capitalizeSetning(ord: string) {
  const oppdelteOrd = ord.split(" ");
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
