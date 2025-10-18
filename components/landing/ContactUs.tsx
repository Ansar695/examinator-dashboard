"use client"

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen pt-16" id='contact'>

      {/* Contact Form & Info */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className="p-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input id="name" placeholder="John Doe" className="h-12" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input id="email" type="email" placeholder="john@example.com" className="h-12" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Input id="subject" placeholder="How can we help?" className="h-12" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your inquiry..." 
                  className="min-h-[150px] resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all hover:scale-105"
              >
                Send Message
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Reach out to us through any of these channels. Our support team is available 
                Monday to Friday, 9 AM to 6 PM PKT.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: 'Email',
                  content: 'support@examgenpro.com',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  content: '+92 300 1234567',
                  color: 'from-green-500 to-teal-500',
                },
                {
                  icon: MapPin,
                  title: 'Office',
                  content: 'Lahore, Punjab, Pakistan',
                  color: 'from-purple-500 to-pink-500',
                },
              ].map((item, i) => (
                <Card 
                  key={i}
                  className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Business Hours */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
              <h3 className="font-bold text-lg mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
