"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <section className="section pt-32">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-8">
            Terms & <span className="text-gradient">Conditions</span>
          </h1>
          <div className="section-divider mb-10" />

          <div className="glass p-6 md:p-8 lg:p-12 rounded-2xl space-y-6 md:space-y-8 text-sm text-gray-400 leading-relaxed">
            <p className="text-xs text-gray-600">Last updated: May 2026</p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">1. Agreement</h2>
              <p>
                By accessing and using the Swift Designz website (swiftdesignz.co.za) and engaging
                our services, you agree to be bound by these Terms and Conditions. These terms apply
                to Swift Designz Investments CC (Registration No. CC/2026/05589), trading as Swift Designz.
                If you do not agree, please do not use our website or services.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">2. Services</h2>
              <p>
                Swift Designz provides web development, e-commerce store development, mobile app
                and software development, project management training, and AI training services.
                The scope, deliverables, and timeline of each project will be outlined in a
                separate project proposal or agreement.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">3. Quotes & Pricing</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All prices listed on the website are starting prices in South African Rand (ZAR) and may vary based on project scope.</li>
                <li>A detailed quote will be provided after an initial consultation.</li>
                <li>Quotes are valid for 30 days unless otherwise stated.</li>
                <li>A deposit may be required before work commences.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">4. Project Process</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Projects begin once the proposal is accepted and any required deposit is received.</li>
                <li>Timelines are estimates and may vary depending on client feedback and content delivery.</li>
                <li>Design revisions are included as specified in your package. Additional revisions may incur extra costs.</li>
                <li>Final deliverables will be released upon receipt of full payment.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">5. Client Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide all required content, images, and feedback in a timely manner.</li>
                <li>Ensure all materials provided are owned or properly licensed.</li>
                <li>Review and approve deliverables within the agreed timeframe.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">6. Intellectual Property</h2>
              <p>
                Upon full payment, the client receives ownership rights to the final deliverables.
                Swift Designz retains the right to showcase the project in our portfolio unless
                otherwise agreed in writing. Third-party assets (fonts, stock images, plugins)
                are subject to their respective licences.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">7. Limitation of Liability</h2>
              <p>
                Swift Designz shall not be liable for any indirect, incidental, or consequential
                damages arising from the use of our services or website. Our total liability
                shall not exceed the amount paid for the specific service in question.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">8. Cancellation</h2>
              <p>
                Either party may cancel a project with written notice. Any work completed up to
                the point of cancellation will be billed accordingly. Deposits are non-refundable
                unless otherwise agreed.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">9. Governing Law</h2>
              <p>
                These Terms and Conditions are governed by the laws of the Republic of Namibia.
                Swift Designz Investments CC is a registered Namibian Close Corporation
                (Registration No. CC/2026/05589). Any disputes shall be resolved in the competent
                courts of Namibia.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">10. Contact</h2>
              <p>
                For questions regarding these terms, contact us at{" "}
                <a href="mailto:info@swiftdesignz.co.za" className="text-[var(--swift-teal)] hover:underline">
                  info@swiftdesignz.co.za
                </a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
