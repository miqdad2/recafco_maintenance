import { cn } from "@/lib/utils";

export function DataTable({
  headers,
  children
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Td({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("px-4 py-3 align-top", className)}>{children}</td>;
}
