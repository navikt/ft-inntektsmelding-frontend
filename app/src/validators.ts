import { formatStrengTilTall } from "./utils";

export const validateInntekt = (
  v: string | number,
  min?: number,
  max?: number,
) => {
  const asNumber = formatStrengTilTall(v);
  if (Number.isNaN(asNumber)) {
    return "Må være et tall";
  }

  // Backend aksepterer tall med maks 20 siffer. Velger MAX_SAFE_INTEGER som grense for å være under 20 siffer
  if (asNumber > Number.MAX_SAFE_INTEGER) {
    return "Beløpet er for stort";
  }

  if (asNumber < (min ?? -Infinity)) {
    return `Beløpet må være ${min} eller høyere`;
  }

  if (asNumber > (max ?? Infinity)) {
    return `Beløpet må være ${max} eller lavere`;
  }

  return true;
};
