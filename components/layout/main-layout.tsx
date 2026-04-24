"use client";

import type React from "react";
import { LandingNavbar } from "../landing/LandingNavbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <div>{children}</div>
    </div>
  );
}
