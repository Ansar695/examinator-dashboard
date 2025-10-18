"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, FileText, BookOpen, CheckCircle, Sparkles, Zap, Target } from "lucide-react"

const heroSlides = [
  {
    title: "Create Professional Exam Papers",
    subtitle: "AI-Powered Question Generation",
    gradient: "from-blue-600/20 via-purple-600/20 to-pink-600/20",
  },
  {
    title: "Save Hours of Work",
    subtitle: "Intelligent Question Bank",
    gradient: "from-green-600/20 via-teal-600/20 to-blue-600/20",
  },
  {
    title: "Punjab Board Certified",
    subtitle: "Professional Templates",
    gradient: "from-orange-600/20 via-red-600/20 to-purple-600/20",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated Background Slider */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-opacity duration-1000 ${
              currentSlide === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Animated Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "8s", animationDelay: "2s" }}
          />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 animate-scale-in">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Trusted by 10,000+ Educators</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                {heroSlides[currentSlide].title.split(" ").map((word, i) => (
                  <span key={i} className="inline-block mr-4 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    {word}
                  </span>
                ))}
              </h1>

              <p className="text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
                {heroSlides[currentSlide].subtitle}
              </p>

              <p className="text-lg text-muted-foreground max-w-xl animate-fade-in" style={{ animationDelay: "0.6s" }}>
                Generate customized examination papers for Punjab Board in minutes. AI-powered question selection,
                multiple templates, and instant preview.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <Link href="/plans">
                <Button
                  size="lg"
                  className="group text-lg px-10 py-7 bg-gradient-to-r from-primary via-secondary to-primary hover:shadow-2xl transition-all duration-500 hover:scale-110 animate-pulse"
                  style={{ animationDuration: "3s" }}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-7 backdrop-blur-sm bg-background/50 hover:scale-105 transition-all duration-300 hover:shadow-xl border-2"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 animate-fade-in" style={{ animationDelay: "1s" }}>
              {[
                { value: "10K+", label: "Questions" },
                { value: "5K+", label: "Teachers" },
                { value: "50K+", label: "Papers Generated" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative h-[600px] animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="absolute inset-0">
              {[
                { icon: FileText, label: "MCQs", color: "from-blue-500 to-cyan-500", pos: "top-0 left-0", delay: "0s" },
                {
                  icon: BookOpen,
                  label: "Short Questions",
                  color: "from-purple-500 to-pink-500",
                  pos: "top-20 right-0",
                  delay: "0.2s",
                },
                {
                  icon: CheckCircle,
                  label: "Long Questions",
                  color: "from-orange-500 to-red-500",
                  pos: "bottom-40 left-10",
                  delay: "0.4s",
                },
                {
                  icon: Target,
                  label: "Custom Papers",
                  color: "from-green-500 to-teal-500",
                  pos: "bottom-20 right-20",
                  delay: "0.6s",
                },
                {
                  icon: Zap,
                  label: "Instant Preview",
                  color: "from-yellow-500 to-orange-500",
                  pos: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  delay: "0.8s",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className={`absolute ${item.pos} p-6 backdrop-blur-xl bg-background/80 border-2 hover:scale-110 transition-all duration-500 cursor-pointer animate-float hover:shadow-2xl`}
                  style={{
                    animationDelay: item.delay,
                    animationDuration: `${4 + i}s`,
                  }}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform`}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold text-sm whitespace-nowrap">{item.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-12 animate-fade-in" style={{ animationDelay: "1.2s" }}>
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? "w-8 bg-primary" : "w-2 bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
