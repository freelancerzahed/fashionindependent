export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md border border-primary-100 overflow-hidden">
          <div className="bg-primary-600 py-6 px-8">
            <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
            <p className="text-primary-100 mt-2">Last updated: March 15, 2024</p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  1. Agreement to Terms
                </h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  2. Use License
                </h2>
                <p className="text-gray-700 mb-4">
                  Permission is granted to temporarily download one copy of the materials on ECommerce's website for
                  personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                  title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  3. Product Information
                </h2>
                <p className="text-gray-700 mb-4">
                  We strive to provide accurate product information, including descriptions, pricing, and availability.
                  However, we do not warrant that product descriptions or other content is accurate, complete, reliable,
                  current, or error-free.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  4. Pricing and Payment
                </h2>
                <p className="text-gray-700 mb-4">
                  All prices are subject to change without notice. We reserve the right to modify or discontinue
                  products at any time. Payment must be received by us before we dispatch your order.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  5. Shipping and Delivery
                </h2>
                <p className="text-gray-700 mb-4">
                  We will arrange for shipment of products to you. Title and risk of loss pass to you upon our delivery
                  to the carrier. Shipping and delivery dates are estimates only and cannot be guaranteed.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  6. Returns and Refunds
                </h2>
                <p className="text-gray-700 mb-4">
                  We accept returns of unused items in original packaging within 30 days of delivery. Refunds will be
                  processed within 5-10 business days after we receive the returned item.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  7. Privacy Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
                  website, to understand our practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-700 mb-4">
                  In no event shall ECommerce or its suppliers be liable for any damages (including, without limitation,
                  damages for loss of data or profit, or due to business interruption) arising out of the use or
                  inability to use the materials on ECommerce's website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  9. Governing Law
                </h2>
                <p className="text-gray-700 mb-4">
                  These terms and conditions are governed by and construed in accordance with the laws of New York and
                  you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
              </section>

              <section className="mb-4">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  10. Contact Information
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms & Conditions, please contact us at:
                </p>
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <p className="text-gray-700 mb-1">
                    Email: <span className="text-primary-700">legal@ecommerce.com</span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    Phone: <span className="text-primary-700">+1 (555) 123-4567</span>
                  </p>
                  <p className="text-gray-700">Address: 123 Commerce Street, New York, NY 10001</p>
                </div>
              </section>
            </div>
          </div>

          <div className="bg-primary-50 p-4 text-center border-t border-primary-100">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
