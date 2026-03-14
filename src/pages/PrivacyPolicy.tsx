import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground">Last updated: March 12, 2026</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              At Local Hero, we believe privacy is a fundamental right. This policy explains 
              how we collect, use, and protect your personal information when you use our platform.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                <Eye size={20} className="text-primary" />
                Information We Collect
              </h2>
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Account Information</h3>
                  <p className="text-muted-foreground text-sm">
                    When you create an account, we collect your email address, display name, 
                    and optional profile information like your avatar and bio.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Activity Data</h3>
                  <p className="text-muted-foreground text-sm">
                    We collect data about your quest completions, points earned, streaks, 
                    and interactions with other users to power your hero journey.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Location Data</h3>
                  <p className="text-muted-foreground text-sm">
                    With your permission, we use your location to show nearby quests, 
                    discovery drops, and community challenges. You can disable this anytime 
                    in your device settings.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                <Lock size={20} className="text-primary" />
                How We Protect Your Data
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">End-to-end encryption:</strong> All data 
                    transmitted between your device and our servers is encrypted using industry-standard TLS.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">Secure storage:</strong> Your data is stored 
                    in secure, SOC 2 compliant data centers with strict access controls.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">Regular audits:</strong> We conduct 
                    security audits and penetration testing to identify and address vulnerabilities.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong className="text-foreground">Minimal data retention:</strong> We only 
                    keep your data as long as necessary for the functioning of the platform.
                  </span>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                <Database size={20} className="text-primary" />
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-4">
                We use your data solely to provide and improve the Local Hero experience:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Personalize your quest recommendations",
                  "Calculate and display your impact stats",
                  "Match you with relevant community challenges",
                  "Send notifications about quests and rewards",
                  "Prevent fraud and abuse",
                  "Improve our AI-powered quest suggestions",
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-lg p-4">
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Your Rights & Choices
              </h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  You have full control over your data:
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• <strong className="text-foreground">Access:</strong> View all data we have about you</li>
                  <li>• <strong className="text-foreground">Export:</strong> Download your data in a portable format</li>
                  <li>• <strong className="text-foreground">Correction:</strong> Update or fix inaccurate information</li>
                  <li>• <strong className="text-foreground">Deletion:</strong> Permanently delete your account and all associated data</li>
                  <li>• <strong className="text-foreground">Opt-out:</strong> Disable data collection for analytics</li>
                </ul>
                <p className="text-muted-foreground text-sm mt-4">
                  To exercise these rights, email us at{" "}
                  <a href="mailto:privacy@localhero.space" className="text-primary hover:underline">
                    privacy@localhero.space
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Third-Party Sharing
              </h2>
              <p className="text-muted-foreground">
                We never sell your personal data. We only share information with third parties 
                when necessary to provide our services:
              </p>
              <ul className="mt-4 space-y-2 text-muted-foreground text-sm">
                <li>• Cloud infrastructure providers (AWS, Google Cloud)</li>
                <li>• Analytics services (anonymized data only)</li>
                <li>• Payment processors (when you make purchases)</li>
                <li>• Law enforcement when legally required</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-muted-foreground">
                Local Hero is designed to be family-friendly. Children under 13 must have 
                parental consent to create an account. We never knowingly collect personal 
                information from children without verifiable parental consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                <Mail size={20} className="text-primary" />
                Contact Us
              </h2>
              <p className="text-muted-foreground mb-4">
                Have questions about privacy? We&apos;re here to help.
              </p>
              <div className="glass-card rounded-xl p-6">
                <p className="text-foreground font-medium mb-2">Local Hero Privacy Team</p>
                <p className="text-muted-foreground text-sm mb-1">
                  Email:{" "}
                  <a href="mailto:privacy@localhero.space" className="text-primary hover:underline">
                    privacy@localhero.space
                  </a>
                </p>
                <p className="text-muted-foreground text-sm">
                  Response time: Within 48 hours
                </p>
              </div>
            </section>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                By using Local Hero, you agree to this Privacy Policy. We may update this 
                policy occasionally and will notify you of significant changes via email or 
                in-app notifications.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
