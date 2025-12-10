"use client";

import React from "react";
import { MoreVertical, Check, Ban, UserX, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { StatusBadge, User } from "@/components/user-management/StatusBadge";
import { RoleBadge } from "@/components/user-management/RoleBadge";
import Link from "next/link";

interface UsersTableProps {
  filteredUsers: User[];
  handleApprove: (userId: string) => void;
  handleSuspend: (userId: string) => void;
  handleInactivate: (userId: string) => void;
  handleUserEdit: (user: User) => void;
}

const UsersTable = (props: UsersTableProps) => {
  const {
    filteredUsers,
    handleApprove,
    handleSuspend,
    handleInactivate,
    handleUserEdit,
  } = props;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Institution</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-12 text-gray-500">
              No users found matching your criteria
            </TableCell>
          </TableRow>
        ) : (
          filteredUsers.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-3 cursor-pointer">
                    <Avatar>
                      <AvatarImage
                        src={user.profilePicture || undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell>{user.phone || "-"}</TableCell>
              <TableCell>
                {user.institutionName ? (
                  <div className="flex items-center gap-2">
                    {user.institutionLogo && (
                      <img
                        src={user.institutionLogo}
                        alt=""
                        className="h-6 w-6 rounded"
                      />
                    )}
                    <span className="text-sm">{user.institutionName}</span>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleApprove(user.id)}
                        disabled={user.status === "ACTIVE"}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUserEdit(user)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleSuspend(user.id)}
                        disabled={user.status === "SUSPENDED"}
                        className="text-orange-600"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleInactivate(user.id)}
                        disabled={user.status === "INACTIVE"}
                        className="text-orange-600"
                      >
                        <UserX className="h-4 w-4 mr-2" />
                        Inactivate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
