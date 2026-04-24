"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type GeneratedPapersHeaderProps = {
  title?: string;
  subtitle?: string;
  primaryActionHref?: string;
};

export default function GeneratedPapersHeader({
  title = "Generated Papers",
  subtitle = "Search, sort, and manage papers created by your institution team.",
  primaryActionHref = "/teacher/paper-builder",
}: GeneratedPapersHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">{subtitle}</p>
      </div>
      <Link href={primaryActionHref}>
        <Button className="gap-2 w-full lg:w-auto h-11">
          <Plus size={18} />
          Create New Paper
        </Button>
      </Link>
    </div>
  );
}

