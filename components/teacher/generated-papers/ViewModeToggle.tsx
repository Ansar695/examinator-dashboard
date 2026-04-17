"use client";

import { Grid3x3, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type PapersViewMode = "grid" | "list";

type ViewModeToggleProps = {
  value: PapersViewMode;
  onChange: (value: PapersViewMode) => void;
};

export default function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val === "grid" || val === "list") onChange(val);
      }}
      className="justify-start"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view" className="h-11 w-11">
        <Grid3x3 className="h-5 w-5" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view" className="h-11 w-11">
        <List className="h-5 w-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

