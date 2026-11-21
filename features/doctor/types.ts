export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type Booking = {
  id: string;
  startAt: string;
  endAt: string | null;
  status: string;
  reason: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
};

export type WaitingStatus = "WAITING" | "IN_CONSULTATION" | "COMPLETED";

export type WaitingEntry = {
  id: string;
  status: string;
  appointmentId: string;
  patientName: string;
  startAt: string;
  checkedInAt: string;
};

export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  birthDay: string;
};

export type ConsultationSummary = {
  id: string;
  date: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  observation: string;
  isSharedWithPatient: boolean;
};

export type PrivateNote = { id: string; content: string; createdAt: string };

export type PrescriptionItem = {
  id: string;
  medicationName: string;
  dosage: string;
  duration: string;
  frequency: string;
  instructions: string;
};

// export type Prescription = {
//   id: string;
//   notes: string;
//   issuedAt: string;
//   items: PrescriptionItem[];
// };

export type ConsultationDetail = ConsultationSummary & {
  privateNotes: PrivateNote[];
  prescriptions: Prescription[];
};

export type PatientProfile = {
  patient: Patient;
  consultations: ConsultationSummary[];
};

export type Prescription = {
  id: string;
  notes: string;
  issuedAt: string;
  pdfUrl: string;
  items: PrescriptionItem[];
};
