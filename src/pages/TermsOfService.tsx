import { ArrowLeft, Scale, FileText, Users, Ban, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TermsOfService = () => {
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
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Terms of Service
              </h1>
              <p className="text-sm text-muted-foreground">Last updated: March 12, 2026</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Welcome to Local Hero! These terms govern your use of our platform. By signing up 
              or using our services, you agree to these terms. Please read them carefully.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                <FileText size={20} className="text-primary" />
                1. What Local Hero Is
              </h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  Local Hero is a gamified platform that connects people with real-world impact 
                  opportunities in their local communities. Through quests, challenges, and 
                  rewards, we make doing good fun and engaging.
                </p>
                <p className="text-muted-foreground text-sm">
                  <strong className="text-foreground">Not a game of chance:</strong> Local Hero 
                  rewards actual real-world actions and impact. Points, badges, and rewards are 
                  earned through genuine community participation, not random outcomes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                <Users size={20} className="text-primary" />
                2. Account Requirements
              </h2>
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Eligibility</h3>
                  <p className="text-muted-foreground text-sm">
                    You must be at least 13 years old to use Local Hero. If you&apos;re under 18, 
                    you need parental or guardian consent. By creating an account, you represent 
                    that you meet these requirements.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Account Security</h3>
                  <p className="text-muted-foreground text-sm">
                    You&apos;re responsible for maintaining the security of your account. Keep 
                    your password confidential and notify us immediately of any unauthorized 
                    access.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">One Account Per Person</h3>
                  <p className="text-muted-foreground text-sm">
                    Each user may maintain only one account. Creating multiple accounts to 
                    manipulate rewards or leaderboard rankings is prohibited.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                3. Quest Completion Rules
              </h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  To maintain fairness and integrity:
                </p>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      <strong className="text-foreground">Complete quests honestly:</strong>{" "}
                      Only mark quests complete when you&apos;ve actually done the activity.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      <strong className="text-foreground">Respect verification:</strong>{" "}
                      Some quests require photo proof or location verification — provide 
                      authentic evidence.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>
                      <strong className="text-foreground">Follow safety guidelines:</strong>{" "}
                      Complete outdoor quests safely and in accordance with local laws and regulations.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                <Ban size={20} className="text-primary" />
                4. Prohibited Activities
              </h2>
              <p className="text-muted-foreground mb-4">
                The following will result in immediate account termination:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Creating fake quest completions",
                  "Using bots or automation tools",
                  "Exploiting bugs or glitches",
                  "Harassment of other users",
                  "Posting inappropriate content",
                  "Selling or trading accounts",
                  "Fraudulent reward claims",
                  "Impersonating other users",
                ].map((item, i) => (
                  <div key={i} className="glass-card rounded-lg p-3 border-l-2 border-destructive">
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                5. Intellectual Property
              </h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  Local Hero content, including logos, designs, quest concepts, and software, 
                  is protected by copyright and trademark laws.
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>
                    <strong className="text-foreground">Your content:</strong> You retain 
                    ownership of photos and content you upload, but grant us a license to use 
                    them to operate the platform.
                  </li>
                  <li>
                    <strong className="text-foreground">Our content:</strong> You may not 
                    copy, modify, or distribute Local Hero materials without written permission.
                  </li>
                  <li>
                    <strong className="text-foreground">NFTs:</strong> Digital collectibles 
                    you earn or mint are subject to additional licensing terms specified at minting.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                6. Rewards & Virtual Currency
              </h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  HERO points and other virtual rewards:
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Have no monetary value and cannot be redeemed for cash</li>
                  <li>• May be used to redeem partner rewards or digital collectibles</li>
                  <li>• Can be forfeited if obtained through fraudulent means</li>
                  <li>• Remain tied to your account and cannot be transferred</li>
                  <li>• May expire if your account becomes inactive for 12+ months</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                7. Disclaimer of Warranties
              </h2>
              <div className="glass-card rounded-xl p-6 border-l-2 border-hero-yellow">
                <p className="text-muted-foreground text-sm">
                  Local Hero is provided &quot;as is&quot; without warranties of any kind. We 
                  strive for 100% uptime but cannot guarantee uninterrupted service. Quest 
                  locations and partner offers are subject to change without notice.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                Local Hero is not liable for:
              </p>
              <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
                <li>• Injuries or incidents occurring during quest completion</li>
                <li>• Loss of data or virtual rewards</li>
                <li>• Third-party partner failures to honor rewards</li>
                <li>• Service interruptions or downtime</li>
              </ul>
              <p className="text-muted-foreground text-sm mt-4">
                <strong className="text-foreground">Stay safe:</strong> Always prioritize 
                personal safety over quest completion. Follow local laws and use common sense.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
                <Gavel size={20} className="text-primary" />
                9. Termination
              </h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  We reserve the right to suspend or terminate accounts that:
                </p>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Violate these terms</li>
                  <li>• Engage in fraudulent activity</li>
                  <li>• Remain inactive for extended periods</li>
                  <li>• Pose a risk to other users or the platform</li>
                </ul>
                <p className="text-muted-foreground text-sm mt-4">
                  You may delete your account at any time through the app settings. Upon 
                  termination, your data will be deleted in accordance with our Privacy Policy.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-muted-foreground">
                We may update these terms from time to time. Significant changes will be 
                communicated via email or in-app notifications. Continued use of Local Hero 
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                11. Governing Law
              </h2>
              <p className="text-muted-foreground">
                These terms are governed by the laws of Germany. Any disputes will be resolved 
                in the courts of Berlin, Germany.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                12. Contact
              </h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-foreground font-medium mb-2">Local Hero Legal Team</p>
                <p className="text-muted-foreground text-sm mb-1">
                  Email:{" "}
                  <a href="mailto:legal@localhero.space" className="text-primary hover:underline">
                    legal@localhero.space
                  </a>
                </p>
                <p className="text-muted-foreground text-sm">
                  Response time: Within 72 hours
                </p>
              </div>
            </section>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                By using Local Hero, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms of Service. If you do not agree, please do not use 
                our platform.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfService;
