"use client"

import { CTASection } from "@/components/landing/CtaSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorks } from "@/components/landing/Guide";
import { HeroSection } from "@/components/landing/Hero";
import { AboutSection } from "@/components/landing/AboutSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { ValuesSection } from "@/components/landing/ValuesSection";
import { TeamSection } from "@/components/landing/TeamSection";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { MainLayout } from "@/components/layout/main-layout";
import Contact from "@/components/landing/ContactUs";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data } = useSession()
  return (
    <MainLayout>
      <div id="home" className="pt-16">
        <HeroSection isRegistered={data?.user} />
      </div>
      <AboutSection />
      <HowItWorks />
      <FeaturesGrid />
      <MissionSection isRegistered={data?.user} />
      <ValuesSection />
      <TeamSection />
      <Contact />
      <CTASection />
    </MainLayout>
  )
}
