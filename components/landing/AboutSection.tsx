"use client"

import { Card } from '@/components/ui/card';
import { Target, Users, Award, Zap } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            About Us
          </div>
          <h2 className="text-5xl font-bold mb-6">Revolutionizing Education</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're transforming how educators create examination papers with AI-powered 
            technology and intelligent question banks designed specifically for Punjab Board.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          {[
            { icon: Target, title: '10K+', subtitle: 'Questions Available', color: 'from-blue-500 to-cyan-500' },
            { icon: Users, title: '5K+', subtitle: 'Active Teachers', color: 'from-purple-500 to-pink-500' },
            { icon: Award, title: '50K+', subtitle: 'Papers Generated', color: 'from-green-500 to-teal-500' },
            { icon: Zap, title: '95%', subtitle: 'Time Saved', color: 'from-orange-500 to-red-500' },
          ].map((stat, i) => (
            <Card
              key={i}
              className="p-6 text-center hover:scale-105 transition-all duration-500 hover:shadow-xl backdrop-blur-sm bg-background/50"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.title}</div>
              <div className="text-sm text-muted-foreground">{stat.subtitle}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}