export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md border border-primary-100 overflow-hidden">
          <div className="bg-primary-600 py-6 px-8">
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="text-primary-100 mt-2">Last updated: March 15, 2024</p>
          </div>

          <div className="p-8">
            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  1. Information We Collect
                </h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, make a
                  purchase, or contact us for support. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by our payment providers)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with our customer service team</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  2. How We Use Your Information
                </h2>
                <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Provide customer support</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  3. Information Sharing
                </h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except as
                  described in this policy:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                  <li>Service providers who assist us in operating our website and conducting business</li>
                  <li>Payment processors for secure transaction processing</li>
                  <li>Shipping companies for order fulfillment</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  4. Data Security
                </h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information by authorized personnel only</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  5. Cookies and Tracking
                </h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze website
                  traffic, and understand where our visitors are coming from. You can control cookie settings through
                  your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  6. Your Rights
                </h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-1">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your personal information</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  7. Children's Privacy
                </h2>
                <p className="text-gray-700 mb-4">
                  Our website is not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If you are a parent or guardian and believe your child has
                  provided us with personal information, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  8. Changes to This Policy
                </h2>
                <p className="text-gray-700 mb-4">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the
                  new privacy policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-4">
                <h2 className="text-2xl font-semibold mb-4 text-primary-800 border-b border-primary-200 pb-2">
                  9. Contact Us
                </h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <p className="text-gray-700 mb-1">
                    Email: <span className="text-primary-700">privacy@ecommerce.com</span>
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
