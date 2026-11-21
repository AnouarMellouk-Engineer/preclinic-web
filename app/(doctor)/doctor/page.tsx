import { redirect } from "next/navigation";

import { DOCTOR_ROUTES } from "@/features/doctor/constants";

export default function DoctorHome() {
  redirect(DOCTOR_ROUTES.dashboard);
}
