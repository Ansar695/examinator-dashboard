"use client";

import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PapersErrorStateProps = {
  title?: string;
  description?: string;
  onRetry: () => void;
};

export default function PapersErrorState({
  title = "Could not load papers",
  description = "Please check your internet connection or try again.",
  onRetry,
}: PapersErrorStateProps) {
  return (
    <Card className="p-10 text-center border bg-card">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mt-5">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
      <div className="mt-6 flex justify-center">
        <Button variant="outline" className="h-11" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </Card>
  );
}

