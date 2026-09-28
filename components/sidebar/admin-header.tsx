"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();
  const { mutate } = useLogout();
  const handleLogout = () => {
    // connect auth logout here
    mutate();
    router.push("/login");
  };

  const data = useMe();
  const currentUser = data.data?.data;

  return (
    <div className="flex items-center gap-3 px-4 py-5 text-center">
      <Avatar>
        <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="">
        <div className="text-xs font-semibold text-muted-foreground">
          {currentUser?.name}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              aria-label="Log out"
            />
          }
        >
          <LogOut className="size-4 text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
