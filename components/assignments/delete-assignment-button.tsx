"use client";

import { Trash2 } from "lucide-react";
import { deleteAssignmentLink } from "@/app/(admin)/actions";
import { Button } from "@/components/ui/button";

type DeleteAssignmentButtonProps = {
  assignmentId: string;
  label: string;
};

export function DeleteAssignmentButton({ assignmentId, label }: DeleteAssignmentButtonProps) {
  return (
    <form
      action={deleteAssignmentLink}
      onSubmit={(event) => {
        if (!confirm(`Delete the question link for "${label}"? The old link will stop working.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="assignment_id" value={assignmentId} />
      <Button type="submit" variant="danger">
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </form>
  );
}
