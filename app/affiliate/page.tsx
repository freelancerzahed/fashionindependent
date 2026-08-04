"use client";

import Link from "next/link";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Partner With Fashion Independent
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-neutral-600">
          Join our affiliate program and earn commission by promoting independent fashion brands.
        </p>
        <Button
          className="text-lg px-8 py-6 rounded-2xl shadow-lg"
          asChild
        >
          <Link href="/affiliate/apply">Apply Now</Link>
        </Button>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Sign Up", desc: "Apply to become an affiliate in minutes." },
            { title: "Share", desc: "Promote products using your unique links." },
            { title: "Earn", desc: "Get paid commission on every sale you drive." }
          ].map((item, i) => (
            <Card key={i} className="rounded-2xl shadow-md">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-neutral-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Commission Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Earn Competitive Commission</h2>
          <p className="text-neutral-600 mb-6">
            We offer generous commission rates on every successful referral. The more you promote, the more you earn.
          </p>
          <div className="text-5xl font-bold">Up to 20%</div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Why Join?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            "Access to exclusive fashion brands",
            "Real-time tracking dashboard",
            "Monthly payouts",
            "Dedicated affiliate support"
          ].map((benefit, i) => (
            <Card key={i} className="rounded-2xl shadow-md">
              <CardContent className="p-6">
                <p className="text-lg">✓ {benefit}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6 bg-neutral-900 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Earning?
        </h2>
        <p className="mb-8 text-neutral-300">
          Join the Fashion Independent affiliate program today.
        </p>
        <Button
          className="text-lg px-8 py-6 rounded-2xl"
          asChild
        >
          <Link href="/affiliate/apply">Become an Affiliate</Link>
        </Button>
      </section>
    </div>
  );
}