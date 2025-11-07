"use client"

import { TeacherDashboardLayout } from "@/components/layout/teacher-layout"
import Dashboard from "@/components/teacher/Dashboard"
import { useGeDashboardStatsQuery } from "@/lib/api/dashboardApi";
import { useState } from "react"

export default function Home() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
const { data, isLoading, error } = useGeDashboardStatsQuery('');
console.log("Dashboard Stats Data:", data);
//   useEffect(() => {
//     if (status === "loading") return
//     if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
//       router.push("/login")
//     }
//   }, [session, status, router])

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
//     return null
//   }

  return (
    <div>
        <Dashboard 
          isLoading={isLoading}
          statsData={data?.data}
        />
    </div>
  )
}
