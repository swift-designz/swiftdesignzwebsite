"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPage() {
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
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <div className="section-divider mb-10" />

          <div className="glass p-6 md:p-8 lg:p-12 rounded-2xl space-y-6 md:space-y-8 text-sm text-gray-400 leading-relaxed">
            <p className="text-xs text-gray-600">Last updated: May 2026</p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
              <p>
                Swift Designz Investments CC (Registration No. CC/2026/05589), trading as Swift Designz
                (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), respects your privacy and is committed to protecting your
                personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website swiftdesignz.co.za.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
              <p className="mb-3">We may collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Personal Information:</strong> Name, email address, phone number, and any other information you voluntarily provide through our contact form.</li>
                <li><strong className="text-white">Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, and browser information.</li>
                <li><strong className="text-white">Cookies:</strong> Small data files stored on your device. See our <Link href="/cookies" className="text-[var(--swift-teal)] hover:underline">Cookie Policy</Link> for details.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To respond to your enquiries and provide requested services</li>
                <li>To send project quotes and proposals</li>
                <li>To improve our website and user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">4. Data Protection</h2>
              <p>
                We implement appropriate technical and organisational measures to protect your personal data
                against unauthorised access, alteration, disclosure, or destruction. In accordance with South
                Africa&apos;s Protection of Personal Information Act (POPIA), we ensure your data is processed
                lawfully and transparently.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">5. Data Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your
                data with trusted service providers (such as email delivery services) only to the extent
                necessary to provide our services to you.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">6. Your Rights</h2>
              <p className="mb-3">Under POPIA, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request access to your personal data</li>
                <li>Request correction or deletion of your data</li>
                <li>Object to the processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">7. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or wish to exercise your rights, please
                contact us at{" "}
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
