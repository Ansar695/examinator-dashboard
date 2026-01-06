"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContactFormMutation } from "@/lib/api/contactUsApi";
import { Mail, Phone, MapPin, Send, User } from "lucide-react";
import { TextInput } from "../common/form";
import { z } from "zod";
import { contactUsSchema } from "@/utils/schemas/contactUsSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";

type ContactFormData = z.infer<typeof contactUsSchema>;

const Contact = () => {
  const [submitContactForm, { isLoading, isSuccess, isError }] =
    useSubmitContactFormMutation();

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactUsSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data).unwrap();
      toast({
        title: "Success",
        description: "Message sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-16" id="contact">
      {/* Contact Form & Info */}
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className="p-8 animate-fade-in">
            <Toaster />
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <TextInput
                  id="name"
                  label="Full Name"
                  placeholder="John Doe"
                  icon={User}
                  setValue={setValue}
                  value={watch("name")}
                  error={errors.name?.message}
                  required={true}
                  animationDelay="0.2s"
                />
              </div>

              <div className="space-y-2">
                <TextInput
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  icon={Mail}
                  setValue={setValue}
                  value={watch("email")}
                  error={errors.email?.message}
                  required={true}
                  animationDelay="0.3s"
                />
              </div>

              <div className="space-y-2">
                <TextInput
                  id="subject"
                  label="Subject"
                  placeholder="Subject of your message"
                  icon={User}
                  setValue={setValue}
                  value={watch("subject")}
                  error={errors.subject?.message}
                  required={true}
                  animationDelay="0.2s"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-[150px] resize-none border border-gray-300"
                  onChange={(e) => setValue("message", e.target.value)}
                  value={watch("message")}
                  required={true}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all hover:scale-105"
                disabled={isLoading}
              >
                Send Message
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div
            className="space-y-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Reach out to us through any of these channels. Our support team
                is available Monday to Friday, 9 AM to 6 PM PKT.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  content: "support@examgenpro.com",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: "+92 300 1234567",
                  color: "from-green-500 to-teal-500",
                },
                {
                  icon: MapPin,
                  title: "Office",
                  content: "Lahore, Punjab, Pakistan",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}
                    >
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
