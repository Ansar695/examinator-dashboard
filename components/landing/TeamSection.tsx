"use client"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, GraduationCap, Code, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export function TeamSection() {
  return (
    <section id="team" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          Our Team
        </div>
        <h2 className="text-4xl font-bold mb-4">Built by Educators, for Educators</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Our team combines years of teaching experience with cutting-edge technology 
          to create the best paper generation platform.
        </p>
      </div>

      {/* Team Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          {
            icon: GraduationCap,
            title: "20+ Years",
            desc: "Combined teaching experience",
            color: "from-blue-500 to-cyan-500"
          },
          {
            icon: Code,
            title: "Expert Developers",
            desc: "Specialized in EdTech solutions",
            color: "from-purple-500 to-pink-500"
          },
          {
            icon: Users,
            title: "Dedicated Support",
            desc: "Always here to help you",
            color: "from-green-500 to-teal-500"
          },
          {
            icon: Lightbulb,
            title: "Continuous Innovation",
            desc: "Regular updates and features",
            color: "from-orange-500 to-red-500"
          }
        ].map((feature, i) => (
          <Card
            key={i}
            className="p-6 text-center hover:scale-105 transition-all duration-500 hover:shadow-xl animate-fade-in backdrop-blur-sm bg-background/50"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
              <feature.icon className="h-7 w-7 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <h3 className="text-3xl font-bold mb-4">Join Thousands of Educators</h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the future of exam paper generation. Start your free trial today and see why educators love ExamGen Pro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/plans">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}