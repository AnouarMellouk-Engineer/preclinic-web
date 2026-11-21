/**
 * The API docs give no response schema for most doctor endpoints, so everything is
 * normalised tolerantly (bare array or { data | items | results }, nested or flat
 * patient). Adjust here once the real shapes are confirmed.
 */
export type Raw = Record<string, unknown>;

export const isObj = (v: unknown): v is Raw =>
  typeof v === "object" && v !== null && !Array.isArray(v);
export const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export function extractList(raw: unknown): Raw[] {
  if (Array.isArray(raw)) return raw.filter(isObj);
  if (isObj(raw)) {
    for (const key of ["data", "items", "results"]) {
      const value = raw[key];
      if (Array.isArray(value)) return value.filter(isObj);
    }
  }
  return [];
}

export function personName(v: unknown) {
  if (!isObj(v)) return "";
  return `${str(v.firstName) ?? ""} ${str(v.lastName) ?? ""}`.trim();
}

/** Looks for the patient on the record itself, on its appointment, or on `user`. */
// export function findPatient(raw: Raw): Raw | null {
//   const appointment = isObj(raw.appointment) ? raw.appointment : null;
//   for (const candidate of [raw.patient, appointment?.patient, raw.user]) {
//     if (isObj(candidate)) return candidate;
//   }
//   return null;
// }

/** The clinicPatient link: on the record itself (reception) or on its appointment. */
export function findClinicPatient(raw: Raw): Raw | null {
  const appointment = isObj(raw.appointment) ? raw.appointment : null;
  for (const c of [raw.clinicPatient, appointment?.clinicPatient]) {
    if (isObj(c)) return c;
  }
  return null;
}

/** The patient User: clinicPatient.patient first, older guesses as fallback. */
export function findPatient(raw: Raw): Raw | null {
  const appointment = isObj(raw.appointment) ? raw.appointment : null;
  const clinicPatient = findClinicPatient(raw);
  for (const c of [
    clinicPatient?.patient,
    raw.patient,
    appointment?.patient,
    raw.user,
  ]) {
    if (isObj(c)) return c;
  }
  return null;
}
