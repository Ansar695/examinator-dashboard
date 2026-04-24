"use client";

import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardAlert } from "@/types/teacher-dashboard";

const iconByType = {
  info: Info,
  warning: AlertTriangle,
  danger: ShieldAlert,
} as const;

const styleByType: Record<DashboardAlert["type"], string> = {
  info: "border-sky-200 bg-sky-50/60 text-sky-900",
  warning: "border-amber-200 bg-amber-50/60 text-amber-900",
  danger: "border-rose-200 bg-rose-50/60 text-rose-900",
};

type DashboardAlertsProps = {
  alerts?: DashboardAlert[];
  isLoading?: boolean;
};

export default function DashboardAlerts({ alerts, isLoading }: DashboardAlertsProps) {
  if (isLoading) return null;
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 animate-slide-in-up" style={{ animationDelay: "80ms" }}>
      {alerts.slice(0, 3).map((alert) => {
        const Icon = iconByType[alert.type];
        return (
          <Card key={alert.id} className={`p-4 border ${styleByType[alert.type]}`}>
            <div className="flex gap-3">
              <div className="mt-0.5">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-5">{alert.title}</p>
                <p className="text-xs mt-1 opacity-90">{alert.message}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

