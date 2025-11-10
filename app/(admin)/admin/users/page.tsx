"use client";

import React, { useState } from "react";
import {
  Search,
  MoreVertical,
  UserPlus,
  Check,
  Ban,
  UserX,
  Edit,
  Trash2,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useApproveUserMutation,
  useCreateUserMutation,
  useInactivateUserMutation,
  useListUsersQuery,
  useSuspendUserMutation,
  useUpdateUserMutation,
} from "@/lib/api/usersApi";
import { StatusBadge, User } from "@/components/user-management/StatusBadge";
import { RoleBadge } from "@/components/user-management/RoleBadge";
import Filters from "@/components/user-management/Filters";
import UsersTable from "@/components/user-management/UsersTable";

export default function AdminUsersPage() {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const { data, isLoading, refetch } = useListUsersQuery({ page, limit: 20 });
  const [approveUser] = useApproveUserMutation();
  const [suspendUser] = useSuspendUserMutation();
  const [inactivateUser] = useInactivateUserMutation();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleApprove = async (id: string): Promise<void> => {
    try {
      await approveUser({ id }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const handleSuspend = async (id: string): Promise<void> => {
    try {
      await suspendUser({ id }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const handleInactivate = async (id: string): Promise<void> => {
    try {
      await inactivateUser({ id }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error inactivating user:", error);
    }
  };

  const handleCreate = async (): Promise<void> => {
    // try {
    //   setCreating(true);
    //   await createUser({
    //     email: `user${Date.now()}@example.com`,
    //     username: `user${Date.now()}`,
    //     password: "ChangeMe123!",
    //     name: "New User",
    //     role: "TEACHER",
    //   }).unwrap();
    //   refetch();
    // } catch (error) {
    //   console.error("Error creating user:", error);
    // } finally {
    //   setCreating(false);
    // }
  };

  const users: User[] = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  };

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      user.status === statusFilter ||
      (statusFilter === "NOT_SET" && !user.status);
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter((u: User) => u.status === "ACTIVE").length,
    pending: users.filter((u: User) => u.status === "PENDING").length,
    suspended: users.filter((u: User) => u.status === "SUSPENDED").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all users in your system
          </p>
        </div>

        <Filters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          refetch={refetch}
          handleCreate={handleCreate}
        />

        {/* Data Table */}
        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <UsersTable 
                filteredUsers={filteredUsers}
                handleApprove={handleApprove}
                handleSuspend={handleSuspend}
                handleInactivate={handleInactivate}
              />

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-gray-600">
                  Showing {filteredUsers.length} of {pagination.total} users
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(pagination.totalPages)].map((_, idx) => (
                    <Button
                      key={idx}
                      variant={page === idx + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(idx + 1)}
                    >
                      {idx + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage(Math.min(pagination.totalPages, page + 1))
                    }
                    disabled={page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
