"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deactivateDepartment } from "@/app/(admin)/actions";

export function DeleteDepartmentButton({
  departmentId,
  departmentName
}: {
  departmentId: string;
  departmentName: string;
}) {
  return (
    <form
      action={deactivateDepartment}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${departmentName}?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="department_id" value={departmentId} />
      <Button type="submit" variant="danger" className="min-h-9 px-3">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </form>
  );
}
