import { Upload } from "lucide-react";

export function FileUploader({ name = "file" }: { name?: string }) {
  return (
    <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-card px-4 py-6 text-center text-sm hover:bg-muted">
      <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
      <span className="font-medium">Upload supporting file</span>
      <span className="mt-1 text-xs text-muted-foreground">
        PDF, JPG, PNG, XLS, XLSX, DOC, DOCX up to 10MB
      </span>
      <input
        className="sr-only"
        name={name}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx,.doc,.docx"
      />
    </label>
  );
}
