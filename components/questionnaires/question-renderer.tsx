import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type QuestionRendererProps = {
  name: string;
  label: string;
  type: "short_text" | "long_text" | "yes_no" | "number" | "date";
  required?: boolean;
};

export function QuestionRenderer({ name, label, type, required }: QuestionRendererProps) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      {type === "long_text" ? <Textarea name={name} required={required} /> : null}
      {type === "yes_no" ? (
        <Select name={name} required={required}>
          <option value="">Select answer</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Select>
      ) : null}
      {type === "number" || type === "date" || type === "short_text" ? (
        <Input
          name={name}
          type={type === "short_text" ? "text" : type}
          required={required}
        />
      ) : null}
    </label>
  );
}
