import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Figma "Patients" table: 14px medium muted header, 1px #e1e7ef row dividers.
function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader(props: ComponentProps<"thead">) {
  return <thead className="[&_tr]:border-b" {...props} />;
}

function TableBody(props: ComponentProps<"tbody">) {
  return <tbody className="[&_tr:last-child]:border-0" {...props} />;
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b transition-colors hover:bg-muted/50", className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle text-sm font-medium whitespace-nowrap text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-4 py-3.5 align-middle text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
