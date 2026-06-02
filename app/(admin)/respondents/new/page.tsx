import { createRespondent } from "../../actions";
import { PageHeader } from "@/components/layout/page-header";
import { FormSection } from "@/components/forms/form-section";
import { Field } from "@/components/forms/field";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { adminRoles } from "@/lib/permissions/roles";

export default async function NewRespondentPage() {
  await requireRole(adminRoles);
  const supabase = await createClient();
  const { data: departments } = await supabase
    .from("departments")
    .select("id,name")
    .eq("is_active", true)
    .order("name");

  return (
    <>
      <PageHeader
        title="New Respondent"
        description="Create a respondent profile for questionnaire assignment."
      />
      <form action={createRespondent} className="max-w-3xl">
        <FormSection title="Respondent Details">
          <Field label="Department">
            <Select name="department_id" required>
              <option value="">Select department</option>
              {departments?.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Full name">
            <Input name="full_name" required maxLength={120} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Designation">
              <Input name="designation" maxLength={120} />
            </Field>
            <Field label="Access type">
              <Select name="access_type" defaultValue="secure_token">
                <option value="secure_token">Secure token</option>
                <option value="login">Login</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <Input name="email" type="email" />
            </Field>
            <Field label="Phone">
              <Input name="phone" maxLength={40} />
            </Field>
          </div>
          <Field label="Notes">
            <Textarea name="notes" maxLength={1000} />
          </Field>
          <input type="hidden" name="is_active" value="true" />
          <div>
            <Button type="submit">Create respondent</Button>
          </div>
        </FormSection>
      </form>
    </>
  );
}
