"use client"

import { Card } from "@/components/ui/card"
import { BookOpen, Users, FileText, CheckCircle, Award } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Process
          </div>
          <h2 className="text-5xl font-bold mb-6">Create Papers in 6 Easy Steps</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">From selection to download in just minutes</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              step: 1,
              title: "Select Board",
              desc: "Choose Punjab Board or other educational boards",
              icon: BookOpen,
              color: "blue",
            },
            {
              step: 2,
              title: "Choose Class",
              desc: "Pick the class level for your examination",
              icon: Users,
              color: "purple",
            },
            {
              step: 3,
              title: "Pick Subject",
              desc: "Select from Math, Science, English, and more",
              icon: FileText,
              color: "green",
            },
            {
              step: 4,
              title: "Select Chapters",
              desc: "Choose specific chapters for questions",
              icon: BookOpen,
              color: "orange",
            },
            {
              step: 5,
              title: "Choose Questions",
              desc: "Pick MCQs, short, and long questions",
              icon: CheckCircle,
              color: "pink",
            },
            {
              step: 6,
              title: "Preview & Download",
              desc: "Customize, preview, and download your paper",
              icon: Award,
              color: "cyan",
            },
          ].map((step, i) => (
            <Card
              key={i}
              className="p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl border-2 group cursor-pointer animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full transition-all duration-500 group-hover:scale-150" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform`}
                  >
                    {step.step}
                  </div>
                  <step.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
