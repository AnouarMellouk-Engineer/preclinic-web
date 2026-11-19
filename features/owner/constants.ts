export const SPECIALISTS = [
  "CARDIOLOGY",
  "DERMATOLOGY",
  "ENDOCRINOLOGY",
  "GASTROENTEROLOGY",
  "GERIATRICS",
  "NEPHROLOGY",
  "NEUROLOGY",
  "ONCOLOGY",
  "OPHTHALMOLOGY",
  "ORTHOPEDICS",
  "PEDIATRICS",
  "PSYCHIATRY",
  "PULMONOLOGY",
  "RHEUMATOLOGY",
  "UROLOGY",
  "GENERAL_PRACTICE",
  "OTHER",
] as const;
export type Specialist = (typeof SPECIALISTS)[number];

/** CARDIOLOGY -> "Cardiology", GENERAL_PRACTICE -> "General practice" */
export function formatSpecialist(value?: string | null) {
  if (!value) return "-";
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const SPECIALIST_OPTIONS = SPECIALISTS.map((value) => ({
  value,
  label: formatSpecialist(value),
}));

export const OWNER_ROUTES = {
  doctors: "/owner/doctors",
  receptionists: "/owner/receptionists",
} as const;
