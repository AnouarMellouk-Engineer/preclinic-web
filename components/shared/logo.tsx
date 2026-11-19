import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-7 w-[131.384px] shrink-0">
      <div className="absolute inset-[-2.47%_0]">
        <Image
          src="/preclinicLogo.svg"
          alt="Preclinic Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
