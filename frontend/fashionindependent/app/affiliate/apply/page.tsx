"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, TrashIcon, PlusIcon } from "lucide-react";

export default function AffiliateApplyPage() {
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    website: "",
    channels: "",
    audience: "",
    message: "",
  });

  const [additionalWebsites, setAdditionalWebsites] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdditionalWebsiteChange = (index: number, value: string) => {
    const updated = [...additionalWebsites];
    updated[index] = value;
    setAdditionalWebsites(updated);
  };

  const handleAddWebsite = () => {
    if (additionalWebsites.length < 10) {
      setAdditionalWebsites([...additionalWebsites, ""]);
    }
  };

  const handleRemoveWebsite = (index: number) => {
    setAdditionalWebsites(additionalWebsites.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Add API call here to submit the form
      const allWebsites = [formValues.website, ...additionalWebsites.filter(Boolean)];
      console.log("Affiliate application submitted", {
        ...formValues,
        websites: allWebsites,
      });
      setSubmitStatus("success");
      setFormValues({
        fullName: "",
        email: "",
        website: "",
        channels: "",
        audience: "",
        message: "",
      });
      setAdditionalWebsites([]);
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link
            href="/affiliate"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition mb-6"
          >
            <ChevronLeftIcon className="size-4" />
            Back to Affiliate Program
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Affiliate Application</h1>
          <p className="text-lg text-neutral-600">
            Join our affiliate program and start earning commissions today.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {submitStatus === "success" && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
                <p className="font-semibold">Thank you for applying!</p>
                <p className="text-sm">We'll review your application and get back to you soon.</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                <p className="font-semibold">Submission failed</p>
                <p className="text-sm">Please try again later.</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-3">
                <span className="text-sm font-medium text-neutral-900">Full name *</span>
                <Input
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                  className="h-11"
                />
              </label>
              <label className="flex flex-col gap-3">
                <span className="text-sm font-medium text-neutral-900">Email address *</span>
                <Input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  required
                  className="h-11"
                />
              </label>
            </div>

            <label className="flex flex-col gap-3">
              <span className="text-sm font-medium text-neutral-900">Websites/Social Pages *</span>
              <Input
                name="website"
                value={formValues.website}
                onChange={handleChange}
                placeholder="https://yourblog.com"
                required
                className="h-11"
              />
            </label>

            {/* Additional Websites */}
            {additionalWebsites.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-medium text-neutral-600">Additional websites/social pages</p>
                {additionalWebsites.map((website, index) => (
                  <div key={index} className="flex gap-3 items-end">
                    <Input
                      value={website}
                      onChange={(e) => handleAdditionalWebsiteChange(index, e.target.value)}
                      placeholder="https://..."
                      className="h-11 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveWebsite(index)}
                      className="h-11 px-3"
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Website Button */}
            {additionalWebsites.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddWebsite}
                className="w-full h-11 gap-2"
              >
                <PlusIcon className="size-4" />
                Add Website/Social Page ({additionalWebsites.length}/10)
              </Button>
            )}

            <label className="flex flex-col gap-3">
              <span className="text-sm font-medium text-neutral-900">Platforms / promo channels *</span>
              <Input
                name="audience"
                value={formValues.channels}
                onChange={handleChange}
                placeholder="Instagram, blog, newsletter, TikTok, etc."
                required
                className="h-11"
              />
            </label>

            <label className="flex flex-col gap-3">
              <span className="text-sm font-medium text-neutral-900">Audience size*</span>
              <Input
                name="audience"
                value={formValues.audience}
                onChange={handleChange}
                placeholder="Tell us how many followers/subscribers you have across your platforms."
                required
                className="h-11"
              />
            </label>

            <label className="flex flex-col gap-3">
              <span className="text-sm font-medium text-neutral-900">Why do you want to join? *</span>
              <textarea
                name="message"
                value={formValues.message}
                onChange={handleChange}
                className="min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition focus-visible:border-ring focus-visible:ring-ring/50 outline-none placeholder:text-muted-foreground"
                placeholder="Tell us about your audience, engagement rates, and affiliate goals."
                required
              />
            </label>

            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none h-11"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="h-11"
              >
                <Link href="/affiliate">Cancel</Link>
              </Button>
            </div>

            <p className="text-sm text-neutral-600 pt-4">
              * Required fields. We'll review your application and contact you within 48 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
