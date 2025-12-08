export default function PartnershipAgreementPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Partnership Agreement</h1>

        <div className="prose prose-neutral max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Creator Partnership Agreement</h2>
            <p className="text-neutral-700 leading-relaxed">
              This Partnership Agreement ("Agreement") is entered into between Mirror Me Fashion LLC ("Platform") and
              the Creator ("You") for the purpose of launching and managing crowdfunding campaigns on The Fashion
              Independent platform.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">1. Campaign Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Creators must upload a product sample photo or 3D CAD file</li>
              <li>Creators must upload or purchase a verified tech pack</li>
              <li>Campaign must include detailed product description and specifications</li>
              <li>All products must comply with fashion industry standards</li>
              <li>Campaigns are subject to Platform approval before launch</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">2. Revenue Sharing Model</h3>
            <div className="bg-neutral-50 p-6 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span className="font-semibold">10% of total pledges</span>
              </div>
              <div className="flex justify-between">
                <span>Per-Pledge Fee:</span>
                <span className="font-semibold">$2 per pledge</span>
              </div>
              <div className="flex justify-between">
                <span>Manufacturing Costs:</span>
                <span className="font-semibold">Deducted from creator payout</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Creator Receives:</span>
                <span>Pledges - 10% - $2/pledge - Manufacturing</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">3. Manufacturing & Delivery</h3>
            <ul className="list-disc list-inside space-y-2 text-neutral-700">
              <li>Platform offers optional manufacturing services at tiered pricing</li>
              <li>Creators are responsible for product quality and delivery</li>
              <li>Delivery timeline must be clearly communicated to backers</li>
              <li>Platform provides delivery tracking for all campaigns</li>
              <li>Creators must notify backers of any delays within 48 hours</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">4. Intellectual Property</h3>
            <p className="text-neutral-700 leading-relaxed">
              Creators retain all intellectual property rights to their designs. The Platform may use campaign images
              and descriptions for marketing purposes with proper attribution.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">5. Termination</h3>
            <p className="text-neutral-700 leading-relaxed">
              Either party may terminate this agreement with 30 days written notice. Upon termination, all pending
              payouts will be processed according to the revenue sharing model.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">6. Dispute Resolution</h3>
            <p className="text-neutral-700 leading-relaxed">
              Any disputes arising from this agreement shall be resolved through mediation or binding arbitration as
              specified in our Terms & Conditions.
            </p>
          </section>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
            <p className="text-sm text-neutral-700">
              By launching a campaign on The Fashion Independent, you agree to the terms of this Partnership Agreement.
              For questions, please contact our support team at support@thefashionindependent.com
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
