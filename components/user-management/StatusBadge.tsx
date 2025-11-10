"use client"

import React from 'react';
import { Badge } from "@/components/ui/badge";

// Types
export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE' | null;
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  status: UserStatus;   
  age: number | null;
  phone: string | null;
  profilePicture: string | null;
  institutionName: string | null;
  institutionLogo: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Status Badge Component
export const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  if (!status) {
    return <Badge variant="outline" className="bg-gray-100">Not Set</Badge>;
  }
  
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
    ACTIVE: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-100" },
    PENDING: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    SUSPENDED: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100" },
    INACTIVE: { variant: "outline", className: "bg-gray-100 text-gray-800" }
  };

  const config = variants[status] || variants.INACTIVE;
  return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
};