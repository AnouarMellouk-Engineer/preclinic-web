export function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
}

export function AvatarInitials({ firstName, lastName }: { firstName: string; lastName: string }) {
  return (
    <div
      aria-hidden
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-foreground"
    >
      {initials(firstName, lastName)}
    </div>
  );
}
