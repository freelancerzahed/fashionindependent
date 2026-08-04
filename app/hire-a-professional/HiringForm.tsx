"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Freelance",
  "Internship",
];

const jobLocations = [
  "Remote",
  "Hybrid",
  "On-site",
];

const pricingOptions = [
  {
    id: "one",
    title: "One time purchase",
    description: "Single job listing",
    price: 10,
  },
  {
    id: "ten",
    title: "Ten Job Listings",
    description: "Save on multiple listings",
    price: 29,
  },
  {
    id: "twenty",
    title: "Twenty Job Listings",
    description: "Best value for bulk hiring",
    price: 49,
  },
];

export default function HiringForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPricing, setSelectedPricing] = useState("one");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    recruiterName: "",
    contactInfo: "",
    applyInstructions: "",
    companyWebsite: "",
    jobTitle: "",
    employmentType: "Full-time",
    jobLocation: "Remote",
    salaryRange: "",
    jobDescription: "",
    responsibilities: "",
    qualifications: "",
    applicationDeadline: "",
    resumeLink: "",
    resumeRequirements: "",
    // Payment form fields
    fullName: "",
    email: "",
    phone: "",
    billingCompany: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardName: "",
    billingAddress: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Move to step 2 (payment)
    setCurrentStep(2);
    setIsSubmitting(false);
  };

  const handlePaymentSubmit = () => {
    // Placeholder for payment processing
    alert(`Job listing submitted successfully! Selected plan: ${selectedPricing}`);
  };

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          {currentStep === 1 ? (
            <>
              <h2 className="text-3xl font-bold mb-3">Post a Fashion Job Listing</h2>
              <p className="text-neutral-600 mb-8">
                Share your hiring opportunity with our fashion professional network by completing the form below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 space-y-6">
                  <h3 className="text-xl font-semibold">Company & Recruiter</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Company name</span>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="e.g. Mirror Me Fashion"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Recruiter's name</span>
                      <input
                        type="text"
                        name="recruiterName"
                        value={formData.recruiterName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="e.g. Alex Johnson"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Contact info</span>
                      <input
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="Email, phone, or recruiter profile"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Company website</span>
                      <input
                        type="url"
                        name="companyWebsite"
                        value={formData.companyWebsite}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="https://"
                      />
                    </label>
                  </div>
                  <label className="space-y-2 text-sm text-neutral-700">
                    <span>How to apply</span>
                    <textarea
                      name="applyInstructions"
                      value={formData.applyInstructions}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      placeholder="Tell applicants how to apply, which materials to send, and who to contact."
                    />
                  </label>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 space-y-6">
                  <h3 className="text-xl font-semibold">Job Details</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Job title</span>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="e.g. Fashion Production Manager"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Employment type</span>
                      <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      >
                        {employmentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Job location</span>
                      <select
                        name="jobLocation"
                        value={formData.jobLocation}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      >
                        {jobLocations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Salary / pay range</span>
                      <input
                        type="text"
                        name="salaryRange"
                        value={formData.salaryRange}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="e.g. $45k–$60k or competitive"
                      />
                    </label>
                  </div>
                  <label className="space-y-2 text-sm text-neutral-700">
                    <span>Job description</span>
                    <textarea
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      rows={5}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      placeholder="Describe the role, team, and why this opportunity matters."
                    />
                  </label>
                  <label className="space-y-2 text-sm text-neutral-700">
                    <span>Responsibilities</span>
                    <textarea
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      placeholder="List the core responsibilities for this position."
                    />
                  </label>
                  <label className="space-y-2 text-sm text-neutral-700">
                    <span>Qualifications / experience required</span>
                    <textarea
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      placeholder="Summarize required experience, skills, and qualifications."
                    />
                  </label>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 space-y-6">
                  <h3 className="text-xl font-semibold">Application Details</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Application deadline</span>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Upload resume link</span>
                      <input
                        type="url"
                        name="resumeLink"
                        value={formData.resumeLink}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="Upload URL, cloud folder, or application portal"
                      />
                    </label>
                  </div>
                  <label className="space-y-2 text-sm text-neutral-700">
                    <span>Resume requirements</span>
                    <textarea
                      name="resumeRequirements"
                      value={formData.resumeRequirements}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      placeholder="Specify resume format, minimum materials, work samples, or portfolio attachments."
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Submit Job Listing
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-3">Payment</h2>
              <p className="text-neutral-600 mb-8">
                Choose your job listing package to publish your opportunity.
              </p>

              <div className="space-y-6">
                {/* Personal Information */}
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 space-y-6">
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Full name</span>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="e.g. John Doe"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Email address</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Phone number</span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="+1 (555) 123-4567"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Company (optional)</span>
                      <input
                        type="text"
                        name="billingCompany"
                        value={formData.billingCompany}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="Company name"
                      />
                    </label>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 space-y-6">
                  <h3 className="text-xl font-semibold">Payment Information</h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Card number</span>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="1234 5678 9012 3456"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Expiration date</span>
                      <input
                        type="text"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="MM/YY"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>CVV</span>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="123"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-neutral-700">
                      <span>Name on card</span>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                        placeholder="John Doe"
                      />
                    </label>
                  </div>
                  <label className="space-y-2 text-sm text-neutral-700">
                    <span>Billing address</span>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
                      placeholder="123 Main St, City, State, ZIP"
                    />
                  </label>
                </div>

                {/* Pricing Options */}
                <div className="space-y-3">
                  {pricingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-blue-400 transition-colors ${
                        selectedPricing === option.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pricingOption"
                        value={option.id}
                        checked={selectedPricing === option.id}
                        onChange={() => setSelectedPricing(option.id)}
                        className="w-5 h-5"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold">{option.title}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <p className="text-lg font-bold">${option.price}</p>
                    </label>
                  ))}
                </div>

                {/* Buy Button */}
                <Button
                  onClick={handlePaymentSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-semibold text-base"
                >
                  Buy Now
                </Button>

                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                  >
                    Back to Form
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Secure payment processing
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
