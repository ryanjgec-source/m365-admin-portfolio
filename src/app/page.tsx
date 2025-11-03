"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Download, Linkedin, Calendar } from "lucide-react"
import Navigation from "@/components/Navigation"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

export default function Home() {
  const [isDownloading, setIsDownloading] = useState(false)

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleDownloadResume = async () => {
    setIsDownloading(true)
    
    try {
      // Track the download
      const response = await fetch('/api/cv-downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ipAddress: 'client', // Server will get actual IP
          userAgent: navigator.userAgent,
          referrer: document.referrer || null,
        }),
      })

      if (!response.ok) {
        console.error('Failed to track download')
      }

      // Download the PDF
      const link = document.createElement('a')
      link.href = '/resume.pdf'
      link.download = 'Sayan_Ghosh_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Resume downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download resume')
    } finally {
      setIsDownloading(false)
    }
  }

  const certifications = [
    {
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e544155e-c652-4e4a-89d7-b1d475284899/generated_images/microsoft-sc-900-security-compliance-and-7705c29a-20251101191047.jpg",
      name: "Microsoft 365 Certified: Fundamentals (MS-900)",
      date: "June 2023",
      link: "http://linkedin.com/in/sayankghosh/"
    },
    {
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e544155e-c652-4e4a-89d7-b1d475284899/generated_images/microsoft-az-900-azure-fundamentals-cert-fda2cee5-20251101191047.jpg",
      name: "Microsoft Certified: Azure Fundamentals (AZ-900)",
      date: "June 2025",
      link: "http://linkedin.com/in/sayankghosh/"
    },
    {
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e544155e-c652-4e4a-89d7-b1d475284899/generated_images/atlassian-confluence-certification-badge-80f27fdb-20251101191048.jpg",
      name: "Atlassian Certified: Confluence Essentials (ACA-920)",
      date: "May 2025",
      link: "http://linkedin.com/in/sayankghosh/"
    },
    {
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/e544155e-c652-4e4a-89d7-b1d475284899/generated_images/ai-for-everyone-course-completion-badge--1f1286d5-20251101191049.jpg",
      name: "Microsoft 365 Administrator (MS-102)",
      date: "Oct 2025",
      link: "http://linkedin.com/in/sayankghosh/"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient-bg relative overflow-hidden">
        {/* Optional: Abstract geometric patterns */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-green-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Microsoft 365 specialist in <span className="gradient-text-blue">cloud security</span>, <span className="gradient-text-purple">identity management</span>, and <span className="gradient-text-green">automation</span>—helping organizations scale safely without sacrificing user experience.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              4 years securing Microsoft 365 infrastructure across diverse enterprise clients at Accenture—expert in Exchange, Entra ID, Teams, Intune (MDM), and security hardening.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/highlights">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  View Highlights
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                >
                  Contact Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Certifications & Practical Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Certifications */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-foreground">Certifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <a 
                    key={index}
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className="flex flex-col items-center justify-center p-4 h-full hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <Image
                            src={cert.image}
                            alt={cert.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">{cert.date}</p>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column - Practical Skills */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-foreground">Practical Skills</h3>
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Identity & Access Management</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Entra ID configuration and troubleshooting</li>
                    <li>Conditional Access policies (creation and enforcement)</li>
                    <li>Privileged Identity Management (PIM) role setup and governance</li>
                    <li>Role-based Access Control (RBAC) implementation</li>
                    <li>Azure App Registration (single-tenant and multi-tenant)</li>
                    <li>SSO setup for gallery and non-gallery applications</li>
                    <li>Breakglass account configuration and management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Device Management & Mobility</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Microsoft Intune enrollment policies (BYOD, Corporate, iOS/iPad)</li>
                    <li>Mobile device management (MDM) policies</li>
                    <li>Autopilot device provisioning</li>
                    <li>JAMF integration for Apple device management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Microsoft Teams & Collaboration</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Teams AA-CQ setup and configuration</li>
                    <li>Teams Phone System setup with SBC integration</li>
                    <li>Teams phone number assignment and management</li>
                    <li>Teams site creation and recovery (accidental deletion)</li>
                    <li>Exchange Online administration</li>
                    <li>SharePoint administration</li>
                    <li>Power Automate workflow automation</li>
                    <li>Confluence integration and knowledge base management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">User Lifecycle & Licensing</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>User account creation and license assignment</li>
                    <li>Group-based licensing management</li>
                    <li>License types and usage optimization</li>
                    <li>Shared mailbox, Distribution List (DL), and Dynamic Distribution List (DDL) creation</li>
                    <li>Automated user onboarding and offboarding workflows</li>
                    <li>Manager-initiated password delivery for new joiners</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Cloud Migration & Infrastructure</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Cloud-to-cloud M365 tenant migration (users, shared mailboxes, DLs)</li>
                    <li>Multi-tenant migration scenarios</li>
                    <li>OneDrive troubleshooting and issue resolution</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Security & Compliance</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Email forwarding policies and security</li>
                    <li>Mail flow rule creation and management</li>
                    <li>Anti-spam, anti-phishing, anti-malware policy configuration</li>
                    <li>Malicious URL blocking</li>
                    <li>Domain and email whitelisting/blacklisting</li>
                    <li>Microsoft Sentinel alerts configuration and incident investigation</li>
                    <li>Phishing campaign simulation and user awareness</li>
                    <li>Retention policies (mailbox-level and account-level)</li>
                    <li>External email labeling and classification</li>
                    <li>Microsoft Defender for Endpoint configuration</li>
                    <li>Security & Compliance portal management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog / Notes Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Notes & Learnings
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/blog/roomcheck-prototype">
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    How I Prototyped RoomCheck in 2 Hours
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    A quick dive into rapid prototyping with Power Automate and Teams integration.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog/confluence-automation-lessons">
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Lessons from Automating a Confluence Knowledge Base
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    What I learned building Python automation for team documentation.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog/sc-900-real-learnings">
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Beyond the Exam: What I Actually Learned from SC-900
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Real-world security insights that go beyond certification prep.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
          <Link href="/blog">
            <Button variant="outline">
              View All Posts
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact & Resume Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            I'm always open to discussing new opportunities or collaborating on projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a 
              href="http://linkedin.com/in/sayankghosh/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn Profile
              </Button>
            </a>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handleDownloadResume}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-5 w-5" />
              {isDownloading ? 'Downloading...' : 'Download Resume'}
            </Button>
            <a 
              href="https://calendly.com/sayankghosh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Meeting
              </Button>
            </a>
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