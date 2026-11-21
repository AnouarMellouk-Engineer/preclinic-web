import { Logo } from "@/components/shared/logo";
import { AuthHero } from "@/features/auth/components/auth-hero";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-brand-light lg:grid-cols-2">
      <AuthHero />
      <div className="flex min-h-screen flex-col bg-white">
        <main className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="flex w-full max-w-[448px] flex-col items-center gap-10">
            <Logo />
            {children}
          </div>
        </main>
        <footer className="pb-6 text-center text-sm leading-[21px] text-grey-900">
          Copyright @2026 - Preclinic
        </footer>
      </div>
    </div>
  );
}
