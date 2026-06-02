export function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
