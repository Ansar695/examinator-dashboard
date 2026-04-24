"use client";

import { BookOpen, FileText, GraduationCap } from "lucide-react";

type PaperStatsPillsProps = {
  mcqs: number;
  shorts: number;
  longs: number;
};

function Pill({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: number;
  icon: typeof FileText;
  className: string;
}) {
  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${className}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-semibold">{value}</span>
      <span className="text-xs opacity-80">{label}</span>
    </div>
  );
}

export default function PaperStatsPills({ mcqs, shorts, longs }: PaperStatsPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Pill label="MCQs" value={mcqs} icon={FileText} className="bg-blue-50 border-blue-200 text-blue-800" />
      <Pill label="Short" value={shorts} icon={BookOpen} className="bg-emerald-50 border-emerald-200 text-emerald-800" />
      <Pill label="Long" value={longs} icon={GraduationCap} className="bg-orange-50 border-orange-200 text-orange-900" />
    </div>
  );
}

