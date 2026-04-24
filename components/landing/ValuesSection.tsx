"use client"

import { Card } from '@/components/ui/card';
import { Award, Zap, Users, Shield, Heart, Target } from 'lucide-react';

export function ValuesSection() {
  const values = [
    {
      title: 'Quality First',
      desc: 'Every question in our bank is verified and aligned with Punjab Board standards.',
      icon: Award,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Innovation',
      desc: 'We continuously improve our AI to provide better recommendations and features.',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Support',
      desc: 'Our dedicated team is always ready to help you succeed with our platform.',
      icon: Users,
      color: 'from-green-500 to-teal-500',
    },
    {
      title: 'Security',
      desc: 'Your data and generated papers are protected with enterprise-grade security.',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Accessibility',
      desc: 'Making quality education tools available to every educator, everywhere.',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Excellence',
      desc: 'We strive for excellence in every feature and interaction on our platform.',
      icon: Target,
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <section id="values" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Our Values
          </div>
          <h2 className="text-4xl font-bold mb-4">What Drives Us Every Day</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our core values shape everything we do, from product development to customer support
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <Card
              key={i}
              className="p-8 hover:scale-105 transition-all duration-500 hover:shadow-xl animate-fade-in backdrop-blur-sm bg-background/50 border-2 group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <value.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}