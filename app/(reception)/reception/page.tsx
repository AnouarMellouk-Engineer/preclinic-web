import { redirect } from "next/navigation";

import { RECEPTION_ROUTES } from "@/features/reception/constants";

export default function ReceptionHome() {
  redirect(RECEPTION_ROUTES.bookings);
}
