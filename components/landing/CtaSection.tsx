"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "1s" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center animate-fade-in">
        <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join thousands of educators creating professional exam papers with our AI-powered platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/plans">
            <Button
              size="lg"
              className="text-lg px-12 py-7 bg-gradient-to-r from-primary via-secondary to-primary hover:shadow-2xl transition-all duration-500 hover:scale-110 animate-pulse"
              style={{ animationDuration: "3s" }}
            >
              View Pricing Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#contact">
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-12 py-7 border-2 hover:scale-105 transition-all bg-transparent"
            >
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
