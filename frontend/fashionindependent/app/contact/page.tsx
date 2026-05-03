"use client";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { WrenchIcon } from "lucide-react"

export default function ContactPage() {
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false)
  const [showEmails, setShowEmails] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  return (
    <main className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center">Customer Support</h2>   
        <p className="max-w-3xl mx-auto  text-lg text-neutral-700 mb-8 mt-4">
            <strong>Have a question or need support?</strong> Chat with support for a prompt response or send us a message using the Contact Form below. 
            Our team seeks to respond to all email inquiries within 24 hours. We prioritize form requests over direct emails. For the 
            fastest response, please use the contact form for the fastest response if you prefer not to chat.
          </p>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-16 mb-16">
            <div>
                <h2 className="text-2xl font-bold text-center">Company Info</h2>

                <Button 
                  className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-12 font-semibold text-base mt-4"
                  onClick={() => setShowEmails(!showEmails)}
                >
                    {showEmails ? 'Hide Email Contacts' : 'Show Email Contacts'}
                </Button>
                {showEmails && (
                  <div>
                    <p className="mt-4">support@thefashionindependent.com</p>
                    <p className="">billing@thefashionindependent.com</p>
                    <p className="">inquiry@thefashionindependent.com</p>
                    <p className="">press@thefashionindependent.com</p>                  
                  </div>
                )}

                <Button 
                  className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-12 font-semibold text-base mt-4"
                  onClick={() => setShowPhone(!showPhone)}
                >
                    {showPhone ? 'Hide Address' : 'Show Address'}
                </Button>
                {showPhone && (
                  <div>
                    <p className="mt-2">244 Fifth Avenue</p>
                    <p className="">Suite M21</p>
                    <p className="">New York, NY 10001</p>                  
                  </div>
                )}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-center">Chat With Support</h2>          
                <Button
                  className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-12 font-semibold text-base mt-4"
                  onClick={() => setIsChatDialogOpen(true)}
                >
                    Chat With Support
                </Button>

                {isChatDialogOpen && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-lg border">
                    <div className="flex items-center text-center gap-2 mb-2">
                      <WrenchIcon className="size-5 text-neutral-600" />
                      <h3 className="font-semibold text-neutral-900">Coming Soon</h3>
                    </div>
                    <p className="text-sm text-neutral-700 mb-4">
                      Our live chat feature is currently under development. Please use the contact form below or email us directly for support.
                    </p>
                  </div>
                )}
                        
            </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="border border-gray-300 mb-8"></div>
          <h1 className="text-4xl font-bold mb-4 text-center">Contact Form</h1>
          <p className="text-lg text-neutral-700 mb-8 text-center">
            Send us a message and our team will get back to you within 24 hours.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full rounded-md border border-neutral-300 px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary/50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-neutral-300 px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="reason">
                    Reason for Contact
                </label>
                <select className="w-full border border-neutral-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-black">
                    <option value="">Select a reason</option>
                    <option>Refund / Return Request</option>
                    <option>Order Tracking</option>
                    <option>General Inquiry</option>
                    <option>Feedback / Complaints</option>
                    <option>Press and Media</option>
                    <option>Technical Issues</option>
                    <option>Other</option>
                </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full rounded-md border border-neutral-300 px-4 py-3 focus:border-secondary focus:ring-2 focus:ring-secondary/50"
                placeholder="Tell us how we can help"
              />
            </div>

            <Button type="submit" className="w-full" asChild>
              <Link href="/">Send Message</Link>
            </Button>
          </div>
        </div>
      </div>


    </main>
  )
}
