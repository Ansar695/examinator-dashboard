"use client"

import { Card } from "@/components/ui/card"
import { FileText, Sparkles, BookOpen, Zap, Clock, Award, Users, Target } from "lucide-react"

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-5xl font-bold mb-6">Powerful Features</h2>
          <p className="text-muted-foreground text-xl">Everything you need to create perfect exam papers</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileText,
              title: "Multiple Templates",
              desc: "6+ professional paper formats",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Sparkles,
              title: "AI Assistant",
              desc: "Smart question recommendations",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: BookOpen,
              title: "Huge Question Bank",
              desc: "10,000+ verified questions",
              color: "from-green-500 to-teal-500",
            },
            {
              icon: Zap,
              title: "Instant Preview",
              desc: "Real-time editing and preview",
              color: "from-orange-500 to-red-500",
            },
            {
              icon: Clock,
              title: "Save Time",
              desc: "Create papers in minutes",
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: Award,
              title: "Board Certified",
              desc: "Punjab Board approved format",
              color: "from-indigo-500 to-purple-500",
            },
            {
              icon: Users,
              title: "Team Collaboration",
              desc: "Work together seamlessly",
              color: "from-pink-500 to-rose-500",
            },
            {
              icon: Target,
              title: "Custom Branding",
              desc: "Add your school logo",
              color: "from-teal-500 to-green-500",
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="p-6 text-center hover:scale-105 transition-all duration-500 hover:shadow-2xl group cursor-pointer animate-scale-in border-2"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
              >
                <feature.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
