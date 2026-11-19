import { redirect } from "next/navigation";

import { OWNER_ROUTES } from "@/features/owner/constants";

export default function OwnerHome() {
  redirect(OWNER_ROUTES.doctors);
}
