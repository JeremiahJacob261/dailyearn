"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/mobile-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, MessageSquare, User } from "lucide-react";

export default function ContactUsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Auto-fill user data if logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        name: user.fullName || user.full_name || "",
        email: user.email || ""
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get user ID if logged in
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser).id : null;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId
        }),
      });

      if (response.ok) {
        toast({
          title: "Message Sent! ✉️",
          description: "We've received your message and will get back to you soon.",
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-3 h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-black dark:text-white">Contact Us</h1>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 p-6 rounded-xl mb-8 border border-lime-200 dark:border-lime-800">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-lime-600 dark:text-lime-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Get in Touch</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Have questions, suggestions, or need help? We're here to assist you! 
            Send us a message and our support team will get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name" className="text-black dark:text-white flex items-center">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-black dark:text-white flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject" className="text-black dark:text-white">
              Subject
            </Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-black dark:text-white">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us more about your inquiry..."
              required
              rows={6}
              className="mt-2 resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="bg-lime-400 hover:bg-lime-500 text-black font-semibold flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Sending...
                </div>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* FAQ Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">How long does it take to get a response?</p>
              <p>We typically respond within 24-48 hours during business days.</p>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">What if I have a technical issue?</p>
              <p>Please include as much detail as possible about the issue you're experiencing.</p>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Can I suggest new features?</p>
              <p>Absolutely! We love hearing feedback and suggestions from our users.</p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
