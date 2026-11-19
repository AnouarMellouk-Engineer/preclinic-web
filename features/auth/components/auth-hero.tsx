/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";

// Figma "Register" frame, left panel: a 720x1000 stage with masked layers.
const MASK_URL = 'url("/images/auth/hero-mask.svg")';

/** Same mask as Figma: the 720x1000 mask positioned relative to the stage, not to the layer. */
function maskAt(x: number, y: number): CSSProperties {
  return {
    maskImage: MASK_URL,
    maskSize: "720px 1000px",
    maskPosition: `${-x}px ${-y}px`,
    maskRepeat: "no-repeat",
    maskMode: "alpha",
    maskClip: "no-clip",
    maskComposite: "intersect",
  };
}

export function AuthHero() {
  return (
    <aside className="relative hidden overflow-hidden bg-primary lg:block">
      <div className="absolute left-1/2 top-1/2 h-[1000px] w-[720px] -translate-x-1/2 -translate-y-1/2">
        {/* Decoration arcs */}
        <div
          className="absolute flex h-[1061.155px] w-[1158.875px] items-center justify-center"
          style={{ left: 98.06, top: 263.29 }}
        >
          <div className="flex-none -scale-y-100 rotate-180">
            <div
              className="relative h-[1061.155px] w-[1158.875px]"
              style={maskAt(98.057, 263.293)}
            >
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src="/images/auth/hero-decoration.svg"
              />
            </div>
          </div>
        </div>

        {/* Glass rectangle */}
        <div
          className="absolute flex h-[880px] w-[624px] items-center justify-center"
          style={{ left: 48, top: 60 }}
        >
          <div className="flex-none -scale-y-100 rotate-180">
            <div
              className="relative h-[880px] w-[624px] rounded-md border border-white bg-[rgba(6,174,212,0.1)] backdrop-blur-[13px]"
              style={maskAt(48, 60)}
            />
          </div>
        </div>

        {/* Doctor & patient photo */}
        <div
          className="absolute h-[510.602px] w-[504.468px]"
          style={{ left: 94, top: 429, ...maskAt(94, 429) }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              alt=""
              className="absolute left-[-37.82%] top-0 h-full w-[151.86%] max-w-none"
              src="/images/auth/hero-doctors.png"
            />
          </div>
        </div>

        {/* Copy */}
        <div className="absolute left-[122px] top-[101px] flex w-[476px] flex-col gap-2 text-center">
          <h2 className="text-[32px] font-bold leading-[43.2px] text-white">
            Seamless healthcare access with smart, modern clinic
          </h2>
          <p className="text-sm leading-[21px] text-brand-light">
            Experience efficient, secure, and user-friendly healthcare
            management designed for modern clinics and growing practices.
          </p>
        </div>
      </div>
    </aside>
  );
}
