import { redirect } from "next/navigation";

// proxy.ts sends unauthenticated visitors to /login.
export default function Home() {
  redirect("/dashboard");
}
