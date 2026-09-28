"use client";

import { ReactElement, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type GenericFormDialogProps = {
  trigger: ReactElement;
  title: string;
  description?: string;
  contentClassName?: string;
  children: (props: { setOpen: (open: boolean) => void }) => ReactElement;
};

export default function GenericFormDialog({
  trigger,
  title,
  description,
  contentClassName,
  children,
}: GenericFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className={cn(contentClassName)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children({ setOpen })}
      </DialogContent>
    </Dialog>
  );
}
