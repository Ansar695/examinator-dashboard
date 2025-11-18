"use client";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Template1 from "./Teamplate1";

export function TemplatesModal({ isOpen, onOpenChange }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Toaster />
      <DialogContent className="w-full min-w-7xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Paper Templates</DialogTitle>
          <DialogDescription>
            Creating new paper templates to choose from.
          </DialogDescription>
        </DialogHeader>
        <div>
            <Template1 />
        </div>
      </DialogContent>
    </Dialog>
  );
}
