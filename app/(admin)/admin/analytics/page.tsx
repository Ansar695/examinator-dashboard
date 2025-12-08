"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  FileText,
  BookOpen,
  TrendingUp,
  School,
  GraduationCap,
  ClipboardList,
  Brain,
  DollarSign,
  CreditCard,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { StatCard } from "@/components/analytics/StatCard";
import { ChartCard } from "@/components/analytics/ChartCard";
import { Badge } from "@/components/analytics/Badge";
import { DataTable } from "@/components/analytics/DataTable";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const AdminDashboard = () => {
  // Mock data for charts
  const userGrowthData = [
    { date: "Mon", students: 1240, teachers: 145, institutions: 23 },
    { date: "Tue", students: 1380, teachers: 152, institutions: 25 },
    { date: "Wed", students: 1520, teachers: 158, institutions: 26 },
    { date: "Thu", students: 1680, teachers: 165, institutions: 28 },
    { date: "Fri", students: 1850, teachers: 171, institutions: 30 },
    { date: "Sat", students: 2010, teachers: 178, institutions: 32 },
    { date: "Sun", students: 2150, teachers: 185, institutions: 34 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000, subscriptions: 89 },
    { month: "Feb", revenue: 52000, subscriptions: 104 },
    { month: "Mar", revenue: 61000, subscriptions: 122 },
    { month: "Apr", revenue: 58000, subscriptions: 116 },
    { month: "May", revenue: 71000, subscriptions: 142 },
    { month: "Jun", revenue: 83000, subscriptions: 166 },
  ];

  const contentUsageData = [
    {
      subject: "Mathematics",
      mcqs: 12500,
      short: 3400,
      long: 1200,
      papers: 450,
    },
    { subject: "Physics", mcqs: 9800, short: 2800, long: 980, papers: 380 },
    { subject: "Chemistry", mcqs: 8900, short: 2600, long: 850, papers: 340 },
    { subject: "Biology", mcqs: 7600, short: 2200, long: 720, papers: 290 },
    { subject: "English", mcqs: 6800, short: 3100, long: 1100, papers: 410 },
  ];

  const aiGenerationData = [
    { month: "Jan", papers: 320, questions: 4200 },
    { month: "Feb", papers: 450, questions: 5800 },
    { month: "Mar", papers: 580, questions: 7200 },
    { month: "Apr", papers: 720, questions: 9100 },
    { month: "May", papers: 890, questions: 11500 },
    { month: "Jun", papers: 1050, questions: 13800 },
  ];

  const topInstitutions = [
    {
      rank: 1,
      name: "Oxford Academy",
      subscriptions: 24,
      plan: "Premium",
      revenue: "$14,400",
      growth: "+18%",
    },
    {
      rank: 2,
      name: "Cambridge Institute",
      subscriptions: 22,
      plan: "Premium",
      revenue: "$13,200",
      growth: "+22%",
    },
    {
      rank: 3,
      name: "Stanford High School",
      subscriptions: 19,
      plan: "Enterprise",
      revenue: "$19,000",
      growth: "+15%",
    },
    {
      rank: 4,
      name: "Harvard Prep School",
      subscriptions: 18,
      plan: "Premium",
      revenue: "$10,800",
      growth: "+12%",
    },
    {
      rank: 5,
      name: "MIT Academy",
      subscriptions: 16,
      plan: "Enterprise",
      revenue: "$16,000",
      growth: "+25%",
    },
  ];

  const subscriptionDistribution = [
    { name: "Basic", value: 450, color: "#94a3b8", price: "$9.99" },
    { name: "Premium", value: 280, color: "#3b82f6", price: "$29.99" },
    { name: "Enterprise", value: 95, color: "#8b5cf6", price: "$99.99" },
  ];

  const userDistribution = [
    { name: "Students", value: 2150, color: "#3b82f6" },
    { name: "Teachers", value: 185, color: "#10b981" },
    { name: "Institutions", value: 34, color: "#f59e0b" },
  ];

  const engagementData = [
    { activity: "Tests Created", count: 1240 },
    { activity: "Papers Downloaded", count: 3850 },
    { activity: "Notes Accessed", count: 5620 },
    { activity: "AI Generations", count: 2890 },
  ];

  const statsCards = [
    {
      title: "Total Revenue",
      value: "$370,000",
      change: "+28.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subtitle: "Last 6 months",
    },
    {
      title: "Monthly Revenue",
      value: "$83,000",
      change: "+16.9%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      subtitle: "Current month",
    },
    {
      title: "Active Subscriptions",
      value: "825",
      change: "+12.3%",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      subtitle: "166 new this month",
    },
    {
      title: "Total Students",
      value: "2,150",
      change: "+12.5%",
      icon: GraduationCap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Teachers",
      value: "185",
      change: "+8.3%",
      icon: Users,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Institutions",
      value: "34",
      change: "+15.2%",
      icon: School,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Questions",
      value: "45,800",
      change: "+22.1%",
      icon: ClipboardList,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "AI Generations",
      value: "2,890",
      change: "+31.4%",
      icon: Brain,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      subtitle: "This month",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics
            </h1>
            <p className="text-gray-500 mt-1">
              Education Platform Analytics Overview
            </p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="bg-white p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="ai">AI Generation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard
                  title="User Growth Trend"
                  description="Daily active users across all categories"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="students"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                      />
                      <Area
                        type="monotone"
                        dataKey="teachers"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                      />
                      <Area
                        type="monotone"
                        dataKey="institutions"
                        stackId="1"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="User Distribution"
                  description="Current platform user breakdown"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <ChartCard
                title="Platform Engagement"
                description="Key activities across the platform"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <ChartCard
                  title="Revenue Trend"
                  description="Monthly revenue over time"
                  className="lg:col-span-2"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Subscription Plans"
                  description="Distribution by plan type"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subscriptionDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {subscriptionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {subscriptionDistribution.map((plan, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: plan.color }}
                          ></div>
                          <span className="font-medium">{plan.name}</span>
                        </div>
                        <span className="text-gray-600">{plan.price}/mo</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>

              <ChartCard
                title="Top 5 Institutions by Subscriptions"
                description="Most frequently subscribing institutions"
              >
                <DataTable
                  headers={[
                    "Rank",
                    "Institution Name",
                    "Subscriptions",
                    "Plan",
                    "Revenue",
                    "Growth",
                    "Status",
                  ]}
                  data={topInstitutions.map((inst) => [
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold">
                      {inst.rank}
                    </div>,
                    <span className="font-medium">{inst.name}</span>,
                    <span className="font-semibold">{inst.subscriptions}</span>,
                    <Badge
                      variant={
                        inst.plan === "Enterprise" ? "primary" : "success"
                      }
                    >
                      {inst.plan}
                    </Badge>,
                    <span className="font-semibold text-green-600">
                      {inst.revenue}
                    </span>,
                    <span className="text-green-600 font-medium">
                      {inst.growth}
                    </span>,
                    <Badge variant="success">Active</Badge>,
                  ])}
                />
              </ChartCard>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Average Revenue per User
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">$172</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Across all users
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      +8.4% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Subscription Renewal Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">94.2%</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Monthly retention
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      +2.1% improvement
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Churn Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-600">5.8%</p>
                    <p className="text-sm text-gray-600 mt-2">Monthly churn</p>
                    <p className="text-sm text-red-600 mt-1">
                      -1.2% from target
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4">
              <ChartCard
                title="User Registration Trends"
                description="Weekly user registrations by type"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="teachers"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="institutions"
                      stroke="#f59e0b"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Registered
                        </p>
                        <p className="text-3xl font-bold">2,150</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Today</p>
                        <p className="text-2xl font-semibold">1,234</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Avg. Tests/Student
                        </p>
                        <p className="text-2xl font-semibold">8.5</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Teachers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Registered
                        </p>
                        <p className="text-3xl font-bold">185</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Today</p>
                        <p className="text-2xl font-semibold">142</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Avg. Papers Created
                        </p>
                        <p className="text-2xl font-semibold">12.3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600">
                      Institutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Registered
                        </p>
                        <p className="text-3xl font-bold">34</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Today</p>
                        <p className="text-2xl font-semibold">28</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Avg. Users/Institution
                        </p>
                        <p className="text-2xl font-semibold">68.7</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <ChartCard
                title="Content Library by Subject"
                description="Available questions and papers across subjects"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={contentUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mcqs" fill="#3b82f6" name="MCQs" />
                    <Bar
                      dataKey="short"
                      fill="#10b981"
                      name="Short Questions"
                    />
                    <Bar dataKey="long" fill="#f59e0b" name="Long Questions" />
                    <Bar dataKey="papers" fill="#8b5cf6" name="Papers" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">MCQs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">45,600</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Across all subjects
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Short Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">14,100</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Across all subjects
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Long Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-600">4,850</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Across all subjects
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Board Papers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600">542</p>
                    <p className="text-sm text-gray-600 mt-1">Previous years</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Generation Tab */}
            <TabsContent value="ai" className="space-y-4">
              <ChartCard
                title="AI Generation Statistics"
                description="Monthly AI-generated content trend"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={aiGenerationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="papers"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="Papers Generated"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="questions"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      name="Questions Generated"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total AI Papers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-purple-600">4,010</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Generated since launch
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      +890 this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Total AI Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-cyan-600">51,600</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Generated since launch
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      +11,500 this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Generation Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-green-600">97.8%</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Quality approved content
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      +2.3% improvement
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
