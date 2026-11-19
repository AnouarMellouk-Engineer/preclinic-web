import { Surface } from "./surface";

export function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <Surface className="flex flex-col gap-1 p-6">
      <p className="text-2xl leading-8 font-bold text-foreground">{value}</p>
      <p className="text-xs leading-4 text-muted-foreground">{label}</p>
    </Surface>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}
