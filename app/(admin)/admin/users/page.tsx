"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useApproveUserMutation,
  useCreateUserMutation,
  useInactivateUserMutation,
  useListUsersQuery,
  useSuspendUserMutation,
  useUpdateUserMutation,
} from "@/lib/api/usersApi";
import { User } from "@/components/user-management/StatusBadge";
import Filters from "@/components/user-management/Filters";
import UsersTable from "@/components/user-management/UsersTable";
import { UserTableSkeleton } from "@/components/skeletons/UsersManagementSkeleton";
import { AddUserModal } from "@/components/user-management/AddUserModal";
import Pagination from "@/components/common/Pagination";
import CustomPagination from "@/components/common/Pagination";

export default function AdminUsersPage() {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [open, setOpen] = useState(false);
  const[editingUser,setEditingUser]=useState<User|null>(null);

  const { data, isLoading, refetch } = useListUsersQuery({ page, limit: 20 });
  const [approveUser, { isLoading: isApproving }] = useApproveUserMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
  const [inactivateUser, { isLoading: isInactivating }] =
    useInactivateUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const loading =
    isLoading ||
    isApproving ||
    isSuspending ||
    isInactivating ||
    isCreating ||
    isUpdating;

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

  const handleAddModal = () => {
    setOpen(!open);
  };

  const handleUserEdit = (user:User) => {
    setEditingUser(user);
    setOpen(!open);
  }

  const users: User[] = data?.data || [];
  const pagination = data?.meta || {
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
          handleCreate={handleAddModal}
        />

        {/* Data Table */}
        {loading ? (
          <div>
            <UserTableSkeleton />
            {/* <RefreshCw className="h-8 w-8 animate-spin text-gray-400" /> */}
          </div>
        ) : (
          <Card className="p-2">
            <UsersTable
              filteredUsers={filteredUsers}
              handleApprove={handleApprove}
              handleSuspend={handleSuspend}
              handleInactivate={handleInactivate}
              handleUserEdit={handleUserEdit}
            />

            {/* Pagination */}
            <CustomPagination
              totalPages={pagination?.totalPages}
              currentUsers={data?.data?.length}
              currentPage={page}
              limit={pagination?.limit}
              total={pagination?.total}
              onPageChange={(p: number) => setPage(p)}
              isLoading={isLoading}
            />
          </Card>
        )}

        <AddUserModal
          isOpen={open}
          onOpenChange={handleAddModal}
          createUser={createUser}
          updateUser={updateUser}
          editingUser={editingUser}
          isLoading={isCreating || isUpdating}
          refetch={refetch}
        />
      </div>
    </DashboardLayout>
  );
}
