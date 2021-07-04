export function deleteFields<T>(obj: T, ...fields: string[]) {
  fields.forEach(field => delete obj[field]);
}