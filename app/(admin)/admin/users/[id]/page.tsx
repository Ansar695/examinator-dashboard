"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  FileText,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Eye,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  getPlanColor,
  getPlanStatusColor,
  getStatusColor,
} from "@/utils/transformers/getConditionalColor";
import {
  formatDate,
  formatDateTime,
} from "@/utils/transformers/dateYearFormatter";
import Link from "next/link";
import UserDetailHeader from "@/components/users/UserDetailHeader";
import UserDetailStatCard from "@/components/users/UserDetailStatCard";
import ProfileInformationCard from "@/components/users/ProfileInformationCard";
import CurrentSubsCard from "@/components/users/CurrentSubsCard";
import GeneratedPapersCard from "@/components/users/GeneratedPapersCard";
import SubscriptionHistoryCard from "@/components/users/SubscriptionHistoryCard";

// Mock data - replace with actual API data
const userData = {
  id: "user123",
  email: "john.doe@example.com",
  username: "johndoe",
  name: "John Doe",
  role: "STUDENT",
  status: "ACTIVE",
  age: 18,
  phone: "+92 300 1234567",
  profilePicture: null,
  institutionName: "City High School",
  institutionLogo: null,
  approvedAt: "2024-01-15T10:30:00Z",
  createdAt: "2024-01-10T08:00:00Z",
  updatedAt: "2024-12-10T14:20:00Z",
};

const subscriptionData = {
  planType: "PREMIUM",
  monthlyLimit: 100,
  papersGenerated: 45,
  pricePerMonth: 4000,
  renewalDate: "2025-01-10T00:00:00Z",
  isActive: true,
  createdAt: "2024-01-10T08:00:00Z",
};

const generatedPapers = [
  {
    id: "paper1",
    title: "Mathematics Mid-Term Exam",
    totalMarks: 100,
    examTime: "3:00",
    subject: "Mathematics",
    board: "Federal Board",
    class: "Class 10",
    createdAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "paper2",
    title: "Physics Final Exam",
    totalMarks: 75,
    examTime: "2:30",
    subject: "Physics",
    board: "Federal Board",
    class: "Class 10",
    createdAt: "2024-11-28T14:30:00Z",
  },
  {
    id: "paper3",
    title: "Chemistry Quiz",
    totalMarks: 50,
    examTime: "1:30",
    subject: "Chemistry",
    board: "Federal Board",
    class: "Class 10",
    createdAt: "2024-11-25T09:15:00Z",
  },
];

const subscriptionHistory = [
  {
    id: "hist1",
    month: 12,
    year: 2024,
    planType: "PREMIUM",
    monthlyLimit: 100,
    pricePerMonth: 4000,
    papersGenerated: 45,
    planStatus: "ACTIVE",
    cycleStart: "2024-12-10T00:00:00Z",
    cycleEnd: "2025-01-10T00:00:00Z",
  },
  {
    id: "hist2",
    month: 11,
    year: 2024,
    planType: "STANDARD",
    monthlyLimit: 45,
    pricePerMonth: 2000,
    papersGenerated: 42,
    planStatus: "UPGRADED",
    cycleStart: "2024-11-10T00:00:00Z",
    cycleEnd: "2024-12-10T00:00:00Z",
  },
  {
    id: "hist3",
    month: 10,
    year: 2024,
    planType: "FREE",
    monthlyLimit: 3,
    pricePerMonth: 0,
    papersGenerated: 3,
    planStatus: "UPGRADED",
    cycleStart: "2024-10-10T00:00:00Z",
    cycleEnd: "2024-11-10T00:00:00Z",
  },
];

const UserDetailsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link href="/admin/users">
          <Button
            variant="outline"
            className="mb-4 py-3 flex items-center justify-center gap-3 h-12 cursor-pointer bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>
        {/* Header Section */}
        <UserDetailHeader userData={userData} />

        {/* Stats Cards */}
        <UserDetailStatCard
          subscriptionData={subscriptionData}
          generatedPapers={generatedPapers}
        />

        {/* Tabs Section */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white p-1 border border-gray-300 h-12">
            <TabsTrigger
              value="overview"
              className="px-6 py-3 data-[state=active]:bg-green-800 data-[state=active]:text-white h-10"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="papers"
              className="px-6 py-3 data-[state=active]:bg-green-800 data-[state=active]:text-white"
            >
              Generated Papers
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="px-6 py-3 data-[state=active]:bg-green-800 data-[state=active]:text-white"
            >
              Subscription History
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Information */}
              <ProfileInformationCard userData={userData} />

              {/* Current Subscription */}
              <CurrentSubsCard subscriptionData={subscriptionData} />
            </div>
          </TabsContent>

          {/* Generated Papers Tab */}
          <TabsContent value="papers">
            <GeneratedPapersCard generatedPapers={generatedPapers} />
          </TabsContent>

          {/* Subscription History Tab */}
          <TabsContent value="subscription">
            <SubscriptionHistoryCard
              subscriptionHistory={subscriptionHistory}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDetailsPage;
