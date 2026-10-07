/** Customer-facing prose omits the numeric brand suffix. Keep technical names and URLs intact. */
export const editorialBrand = "Temporary Shower Rental";

export function removeBrandNumber(value: string): string {
  return value.replace(/\b(?:Temporary(?: Shower Rental)?|Temp)\s*123\b/gi, editorialBrand);
}
