export function uniqueObjects<T>(array: T[]): T[] {
  const j = array.map(t => JSON.stringify(t));
  const u = [...new Set(j)];
  return u.map(t => JSON.parse(t));
}
