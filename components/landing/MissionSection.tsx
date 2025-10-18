"use client"

import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Clock, Shield, Sparkles, FileText } from 'lucide-react';
import Link from 'next/link';

export function MissionSection() {
  return (
    <section id="mission" className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Our Mission
          </div>
          <h2 className="text-4xl font-bold mb-6">Empowering Educators Through Technology</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            ExamGen Pro was founded with a simple mission: to save educators countless hours 
            spent on creating examination papers while ensuring quality and consistency.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            We believe that teachers should focus on teaching, not on tedious administrative 
            tasks. Our platform combines artificial intelligence with a comprehensive question 
            bank to make paper generation fast, efficient, and reliable.
          </p>
          
          {/* Feature List */}
          <div className="space-y-4 mb-8">
            {[
              { icon: Clock, text: "Save 90% of paper creation time" },
              { icon: Shield, text: "Punjab Board certified questions" },
              { icon: Sparkles, text: "AI-powered smart recommendations" },
              { icon: BookOpen, text: "Comprehensive question bank" }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-muted-foreground">{feature.text}</span>
              </div>
            ))}
          </div>

          <Link href="/select-board">
            <Button size="lg" className="group">
              Start Creating Papers
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
        
        {/* Visual Element */}
        <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8">
              <div className="h-full rounded-lg bg-background/80 backdrop-blur-sm border-2 border-primary/20 p-6 space-y-4">
                {/* Mock Paper Preview */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Mathematics Paper</h3>
                    <p className="text-sm text-muted-foreground">Class 10 - Punjab Board</p>
                  </div>
                </div>
                
                {/* Mock Questions */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-3 bg-muted/50 rounded animate-pulse" style={{ width: `${80 - i * 10}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </section>
  );
}