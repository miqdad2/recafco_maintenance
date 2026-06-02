import { createDepartment } from "../../actions";
import { PageHeader } from "@/components/layout/page-header";
import { FormSection } from "@/components/forms/form-section";
import { Field } from "@/components/forms/field";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { adminRoles } from "@/lib/permissions/roles";

export default async function NewDepartmentPage() {
  await requireRole(adminRoles);

  return (
    <>
      <PageHeader
        title="New Department"
        description="Create an active department for requirement collection."
      />
      <form action={createDepartment} className="max-w-3xl">
        <FormSection title="Department Details">
          <Field label="Department name">
            <Input name="name" required maxLength={120} />
          </Field>
          <Field label="Code">
            <Input name="code" maxLength={30} />
          </Field>
          <Field label="Description">
            <Textarea name="description" maxLength={500} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Manager name">
              <Input name="manager_name" maxLength={120} />
            </Field>
            <Field label="Manager email">
              <Input name="manager_email" type="email" />
            </Field>
          </div>
          <input type="hidden" name="is_active" value="true" />
          <div>
            <Button type="submit">Create department</Button>
          </div>
        </FormSection>
      </form>
    </>
  );
}
