"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Library,
  FileText,
  Plus,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { quickActions } from "./quickActions";
import {
  DashboardData,
  RecentActivity,
} from "@/utils/types/dashboard-overview.types";
import {
  useGetAdminDashboardStatsQuery,
  useGetRecentActivitiesQuery,
  useGetUsersRegStatsQuery,
} from "@/lib/api/adminDashboardAPI";
import UsersStats from "./UsersStats";
import ChartsData from "./ChartsData";
import CustomSpinner from "../shared/CustomSpinner";

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataFilter, setDataFilter] = useState("daily");

  const {
    data: dashboardData,
    isLoading,
    error: queryError,
    refetch,
  } = useGetAdminDashboardStatsQuery("");
  const {
    data: recentActivities,
    isLoading: activityLoading,
    error: activityError,
  } = useGetRecentActivitiesQuery("");
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersRegStatsQuery(`filter=${dataFilter ?? "daily"}`);

  const loading = isLoading || activityLoading || usersLoading;

  const serviceData = useMemo(() => {
    const palette = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    // Fallback static data
    return [
      {
        name: "Students",
        value: dashboardData?.data?.students,
        color: palette[0],
      },
      {
        name: "Teachers",
        value: dashboardData?.data?.teachers,
        color: palette[1],
      },
    ];
  }, []);

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "board":
        return {
          icon: BookOpen,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      case "chapter":
        return {
          icon: FileText,
          color: "text-emerald-600",
          bgColor: "bg-emerald-100",
        };
      case "subject":
        return {
          icon: Library,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        };
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-6">
          <CardContent>
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={refetch} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full h-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your educational content management system
        </p>
      </div>

      {loading ? (
        <CustomSpinner />
      ) : (
        <>
          {/* Top 4 Stats - Main Metrics */}
          <UsersStats stats={dashboardData?.data} />

          {/* Charts Row 1 */}
          <ChartsData
            chartsData={usersData}
            serviceData={serviceData}
            dataFilter={dataFilter}
            setDataFilter={setDataFilter}
          />

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Quick Actions
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => (
                <Card
                  key={action.title}
                  className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="space-y-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${action.bgColor} ${action.hoverColor} flex items-center justify-center transition-colors group-hover:scale-110 duration-200`}
                    >
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        {action.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                    >
                      <Link href={action.href}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="border-0 shadow-md">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-bold text-foreground">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Latest updates across your educational content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (data?.recentActivities?.length ?? 0) === 0 &&
                (data?.papers?.length ?? 0) === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activities
                </p>
              ) : (
                <div className="space-y-4">
                  {(data?.recentActivities ?? []).map((activity) => {
                    const iconData = getActivityIcon(activity.type);
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconData.bgColor}`}
                        >
                          <iconData.icon
                            className={`h-5 w-5 ${iconData.color}`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {activity.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(
                                new Date(activity.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Fallback: Show recent papers from API if no recentActivities */}
                  {(data?.recentActivities?.length ?? 0) === 0 &&
                    (data?.papers ?? []).map((paper: any) => (
                      <div
                        key={paper.id}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border border-border/50 hover:bg-muted/70 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-foreground">
                            {paper.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(new Date(paper.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
