import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

import { OwnerNav } from "./owner-nav";

/** Figma top bar: sticky, white/95 + blur, 1px bottom border, px-24 py-12. */
export function OwnerTopbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white/95 px-6 py-3 backdrop-blur-[2px]">
      <div className="lg:hidden">
        <OwnerNav orientation="horizontal" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground"
          >
            CO
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm leading-5 font-semibold text-foreground">Clinic owner</span>
            <span className="text-xs leading-4 font-semibold text-muted-foreground">Administrator</span>
          </div>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm" className="h-9 gap-1.5 px-3 text-sm">
            <LogOut aria-hidden />
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
