"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type DeletePaperDialogButtonProps = {
  onConfirm: () => Promise<void> | void;
  disabled?: boolean;
  title?: string;
  description?: string;
  buttonLabel?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "destructive" | "outline" | "secondary" | "default" | "ghost" | "link";
  fullWidth?: boolean;
};

export default function DeletePaperDialogButton({
  onConfirm,
  disabled,
  title = "Delete this paper?",
  description = "This action cannot be undone. The paper will be permanently removed from your generated papers list.",
  buttonLabel = "Delete",
  size = "default",
  variant = "outline",
  fullWidth = false,
}: DeletePaperDialogButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          className={[
            fullWidth ? "w-full" : "",
            variant === "outline" ? "border-destructive/30 text-destructive hover:bg-destructive/10" : "",
          ].join(" ")}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {buttonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
