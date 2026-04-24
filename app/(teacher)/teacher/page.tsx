"use client"

import Dashboard from "@/components/teacher/Dashboard"
import { useGetTeacherDashboardQuery } from "@/lib/api/dashboardApi";

export default function Home() {
//   const { data: session, status } = useSession()
//   const router = useRouter()
  const { data, isLoading, isFetching } = useGetTeacherDashboardQuery();
  const isPending = isLoading || (isFetching && !data);

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
          isLoading={isPending}
          statsData={data?.data}
        />
    </div>
  )
}
