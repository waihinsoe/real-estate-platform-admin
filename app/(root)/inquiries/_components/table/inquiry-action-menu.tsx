"use client";

import ActionMenu from "@/components/tanstack-table/menu-item/action-menu";
import GenericFormDialog from "@/components/dialog/generic-form-dialog";
import { Button } from "@/components/ui/button";
import type { Inquiry } from "@/types/inquiry";
import { EditInquiryForm } from "../form/edit-inquiry-form";
import { CreateInquiryActivityForm } from "../form/create-inquiry-activity-form";

export function InquiryActionMenu({ item }: { item: Inquiry }) {
  return (
    <div className="flex items-center gap-2">
      <ActionMenu
        editTitle={`Edit inquiry #${item.id}`}
        onEditForm={({ onClose }) => (
          <EditInquiryForm item={item} onClose={onClose} />
        )}
      />
      <GenericFormDialog
        title={`Inquiry #${item.id} activities`}
        trigger={
          <Button type="button" variant="outline">
            Activities
          </Button>
        }
        contentClassName="max-h-[calc(100dvh-2rem)] overflow-y-auto"
      >
        {({ setOpen }) => (
          <div className="space-y-6">
            {item.message && (
              <p className="whitespace-pre-wrap text-sm">{item.message}</p>
            )}
            {item.activities === undefined ? (
              <p className="text-sm text-muted-foreground">
                Choose “Include activities” in the filters to load activity
                history.
              </p>
            ) : item.activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No activities yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {item.activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="space-y-1 rounded-lg border p-3 text-sm"
                  >
                    <p className="font-medium">{activity.activity_type}</p>
                    <p className="whitespace-pre-wrap">{activity.note}</p>
                    {activity.created_at && (
                      <p className="text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    )}
                    {activity.next_follow_up_at && (
                      <p>
                        Follow-up:{" "}
                        {new Date(activity.next_follow_up_at).toLocaleString()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <CreateInquiryActivityForm
              inquiryId={item.id}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </GenericFormDialog>
    </div>
  );
}
