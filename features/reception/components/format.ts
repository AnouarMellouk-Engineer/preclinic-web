const TZ = "Africa/Algiers";

export function formatDateTime(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: TZ,
  });
}

export function formatTime(iso: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}
