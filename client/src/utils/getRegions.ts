export function getRegions(list: any[]) {
  const regions = new Set<string>();
  list.forEach((s) => regions.add(s.language));
  return Array.from(regions);
}
