// Helper func that deletes all said fields in object.
// Needed not to send user password and other personal data.
export function deleteFields<T>(obj: T, ...fields: string[]) {
  fields.forEach(field => delete obj[field]);
}