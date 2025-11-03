"use client"

import Navigation from "@/components/Navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface HighlightProps {
  title: string
  heroImage: string
  overview: string
  challenge: string
  solution: string
  techTags: string[]
  impact: string
  demoVideoUrl: string
}

function Highlight({ title, heroImage, overview, challenge, solution, techTags, impact, demoVideoUrl }: HighlightProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="mb-12 overflow-hidden">
      <CardContent className="p-0">
        {/* Hero Image */}
        <div className="relative w-full h-64 md:h-96 bg-muted">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{title}</h3>
          
          <p className="text-muted-foreground mb-6 text-lg">{overview}</p>

          {/* Challenge Section - Always visible */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-foreground mb-3">🎯 Challenge</h4>
            <p className="text-muted-foreground leading-relaxed">{challenge}</p>
          </div>

          {/* Expandable Content on Mobile */}
          <div className={`space-y-6 ${!expanded ? 'hidden md:block' : 'block'}`}>
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-3">💡 Solution</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{solution}</p>
            </div>

            {/* Tech Used */}
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-3">🛠️ Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {techTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Impact */}
            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
              <h4 className="text-lg font-semibold text-foreground mb-2">📊 Key Takeaway / Impact</h4>
              <p className="text-foreground font-medium">{impact}</p>
            </div>

            {/* Demo Video Link */}
            <div>
              <a href={demoVideoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  View Details
                </Button>
              </a>
            </div>
          </div>

          {/* Expand/Collapse Button for Mobile */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="md:hidden mt-4 flex items-center gap-2 text-primary font-medium hover:underline"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Read Full Case Study <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HighlightsPage() {
  const highlights: HighlightProps[] = [
    {
      title: "Microsoft Teams - Advanced Administration & Recovery",
      heroImage: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&h=600&fit=crop",
      overview: "Managed complex Teams telephony setup, streamlined policy configurations, and built recovery workflows for accidentally deleted Teams sites.",
      challenge: "Manage complex Teams telephony setup, recover deleted Teams sites, and streamline policy configurations for a multi-department organization with 2,000+ users requiring advanced voice routing capabilities.",
      solution: `Implemented comprehensive Teams administration solution:

• Configured Auto Attendant (AA) and Call Queue (CQ) for multi-department routing with custom business hours and holiday schedules
• Assigned Teams Phone Numbers and created Voice Routing Policies using PowerShell automation
• Integrated Session Border Controller (SBC) for SIP trunk connectivity with failover configuration
• Built Teams site recovery workflow for accidental deletions using SharePoint Admin Center and PowerShell scripts
• Automated phone number assignment process reducing manual intervention
• Created documentation and training materials for ongoing administration`,
      techTags: ["Microsoft Teams Admin Center", "PowerShell", "SBC", "Exchange Online", "Entra ID", "Voice Routing"],
      impact: "Reduced Teams voice setup turnaround time by 50% and improved recovery SLA to <24 hours. Eliminated voice routing issues and provided seamless telephony experience.",
      demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Cloud-to-Cloud Migration (Tenant-to-Tenant)",
      heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
      overview: "Seamlessly migrated users, shared mailboxes, and distribution lists from m365admin.in tenant to infra365.online with zero downtime.",
      challenge: "Seamlessly migrate users, shared mailboxes, and DLs from m365admin.in tenant to infra365.online with zero downtime, while maintaining all permissions, mail flow, and user access throughout the transition.",
      solution: `Executed comprehensive tenant-to-tenant migration:

• Pre-migration assessment: Audited all user objects, shared mailboxes, distribution lists, and permissions
• Migrated all user objects, shared mailboxes, and DLs via PowerShell and MigrationWiz third-party connectors
• Reconfigured DNS records (MX, SPF, DKIM) for seamless mail flow cutover
• Updated authentication endpoints and federated domain settings
• Performed license mapping and assignment automation
• Validated post-migration permissions, delegate access, and mail flow rules
• Implemented coexistence period allowing gradual user cutover
• Created detailed runbooks and rollback procedures`,
      techTags: ["Exchange Online", "PowerShell", "Azure AD", "MigrationWiz", "Admin Portal", "DNS Management"],
      impact: "100% user data retention and zero disruption during migration. Established reusable migration checklist adopted for 5 subsequent tenant migrations. Completed 2-week ahead of schedule.",
      demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Entra ID & Azure AD Governance",
      heroImage: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=600&fit=crop",
      overview: "Strengthened access control, identity governance, and compliance posture through comprehensive Entra ID implementation.",
      challenge: "Strengthen access control, identity governance, and compliance posture for a growing organization with complex role requirements and strict regulatory obligations.",
      solution: `Implemented comprehensive identity and access management framework:

• Implemented Group-based licensing to automate entitlements and reduce manual license assignment errors
• Configured Role-based access control (RBAC) with custom roles for specific administrative scenarios
• Deployed Privileged Identity Management (PIM) for just-in-time privileged access with approval workflows
• Created 20+ Conditional Access (CA) policies to restrict logins by geography, device compliance, and risk level
• Set up Breakglass accounts with documented procedures and regular testing
• Documented license differentiation by roles (E3 vs E5 feature comparison)
• Created and managed SSO for gallery + non-gallery apps via Azure App Registrations (single & multi-tenant)
• Implemented Multi-Factor Authentication enforcement with adaptive policies
• Built automated access review workflows for quarterly compliance audits`,
      techTags: ["Entra ID", "Azure AD Portal", "PIM", "Conditional Access", "PowerShell", "App Registration", "RBAC"],
      impact: "60% reduction in privilege escalations and enhanced compliance audit readiness. Achieved 100% MFA adoption and reduced unauthorized access attempts by 85%.",
      demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Exchange Online Automation",
      heroImage: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200&h=600&fit=crop",
      overview: "Automated mailbox and distribution list management to reduce manual overhead and improve email security posture.",
      challenge: "Automate mailbox and distribution list management to reduce manual overhead that was consuming 15+ hours weekly and causing configuration errors.",
      solution: `Built comprehensive Exchange Online automation suite:

• Automated shared mailbox, DL, and DDL creation with PowerShell scripts and parameter validation
• Built process to notify manager of new joiners with login credentials automatically via Power Automate
• Configured mail flow rules for external email tagging and security
• Deployed anti-phishing policies with impersonation protection
• Implemented retention labels and policies for compliance requirements
• Created automated mailbox permission assignment based on department templates
• Built monitoring dashboard for mailbox storage and quota management
• Documented all processes with step-by-step runbooks`,
      techTags: ["Exchange Admin Center", "PowerShell", "Security & Compliance Center", "Power Automate", "Graph API"],
      impact: "Saved 3–4 admin hours per week, reduced misconfigurations by 90%, increased email security hygiene. Zero delays in new user onboarding.",
      demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Security & Compliance Operations",
      heroImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=600&fit=crop",
      overview: "Improved email protection, compliance, and incident response through comprehensive security operations implementation.",
      challenge: "Improve email protection, compliance, and incident response capabilities while dealing with 50+ phishing attempts weekly and no centralized security monitoring.",
      solution: `Deployed comprehensive security and compliance framework:

• Deployed anti-phishing, anti-spam, and anti-malware rules with custom detection policies
• Created whitelisting/blacklisting policies for trusted and blocked domains
• Configured malicious URL blocking with Safe Links policies
• Implemented external email tagging to prevent impersonation attacks
• Managed Microsoft Sentinel alerts and designed incident response workflows
• Conducted internal phishing simulation campaigns reaching 85% awareness
• Built security playbooks for common incident types
• Configured Data Loss Prevention (DLP) policies for sensitive information
• Implemented retention policies for legal and compliance requirements
• Created executive security dashboards with real-time threat visibility`,
      techTags: ["Microsoft Defender", "Sentinel", "Exchange Online Protection", "Compliance Center", "DLP", "PowerShell"],
      impact: "80% reduction in phishing-related incidents and faster alert triage time by 40%. Achieved SOC 2 compliance readiness and passed external security audit with zero findings.",
      demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Intune Device Management (iOS / iPadOS / BYOD)",
      heroImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=600&fit=crop",
      overview: "Simplified enrollment and compliance management for corporate and personal devices across iOS, iPadOS, and BYOD scenarios.",
      challenge: "Simplify enrollment and compliance management for corporate and personal devices while maintaining strict security controls without impacting user productivity.",
      solution: `Implemented comprehensive mobile device management solution:

• Created enrollment profiles for BYOD and corporate-owned devices with automated setup
• Applied compliance policies and configuration profiles for Wi-Fi, email, and app control
• Integrated Apple Business Manager for automated device enrollment (DEP)
• Configured iOS/iPadOS specific policies for supervised and unsupervised devices
• Implemented app protection policies for corporate data on personal devices
• Built conditional access integration requiring device compliance before resource access
• Created self-service Company Portal experience for users
• Deployed VPN and certificate profiles automatically during enrollment
• Implemented remote wipe capabilities for lost or stolen devices`,
      techTags: ["Microsoft Intune", "Apple Business Manager", "Entra ID", "Conditional Access", "App Protection", "MDM"],
      impact: "100% visibility of device compliance and reduced onboarding time by 50%. Managed 800+ devices with 99% compliance rate. Zero data breaches from mobile devices.",
      demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "RoomCheck - Meeting Room Availability Bot",
      heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop",
      overview: "Built intelligent automation bot using Power Automate to eliminate manual room booking checks and prevent double bookings.",
      challenge: "Eliminate manual room booking checks and prevent double bookings that were causing scheduling conflicts and wasting employee time across 3 office locations.",
      solution: `Created end-to-end automation solution prototyped in just 2 hours:

• Built Power Automate flow triggered by Teams chat mentions (@RoomCheck)
• Integrated with Microsoft Teams and SharePoint Lists for room metadata
• Implemented real-time room availability checking via Exchange Online calendar queries
• Created adaptive cards displaying available rooms with capacity and amenities
• Added one-click booking functionality directly from Teams
• Built recurring morning digest showing day's room bookings
• Implemented conflict detection and automatic resolution suggestions
• Created analytics dashboard showing room utilization patterns`,
      techTags: ["Power Automate", "Microsoft Teams", "SharePoint Lists", "Exchange Online", "Adaptive Cards"],
      impact: "Reduced manual booking checks by 90%, eliminated double bookings, and saved 250+ hours per month organization-wide. Expanded to 3 offices serving 800+ users with 95% satisfaction rate.",
      demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Page Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Real-world Microsoft 365 and Cloud Administration Scenarios
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            A technical showcase of the solutions I've architected and deployed
          </p>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {highlights.map((highlight, index) => (
            <Highlight key={index} {...highlight} />
          ))}
        </div>
      </section>

      {/* Back to Home CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Connect?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Let's discuss how I can help solve your organization's challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="default">
                Get in Touch
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-5xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Sayan K Ghosh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}