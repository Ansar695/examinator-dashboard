"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  title?: string;
  subtitle?: string;
  primaryActionHref: string;
  primaryActionLabel: string;
};

export default function DashboardHeader({
  title = "Dashboard",
  subtitle,
  primaryActionHref,
  primaryActionLabel,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slide-in-up">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
        ) : null}
      </div>
      <Link href={primaryActionHref}>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 w-full md:w-auto">
          <Plus size={20} />
          {primaryActionLabel}
        </Button>
      </Link>
    </div>
  );
}

