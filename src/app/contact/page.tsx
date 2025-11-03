import Navigation from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Download, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Sayan Ghosh | infra365.online",
  description: "Get in touch with Sayan Ghosh at infra365.online to discuss Microsoft 365 projects and opportunities.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Let's Connect
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I'm always open to discussing new opportunities or collaborating on projects.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* LinkedIn Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Linkedin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    LinkedIn Profile
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Connect with me professionally
                  </p>
                  <a 
                    href="http://linkedin.com/in/sayankghosh/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="default" className="w-full">
                      View Profile
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Email Me
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Send me a direct message
                  </p>
                  <a 
                    href="mailto:sayan.ghosh@example.com" 
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      Send Email
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Schedule Meeting
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Book a time to chat
                  </p>
                  <a 
                    href="https://calendly.com/sayankghosh" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      View Calendar
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Resume Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Download Resume
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get my full CV
                  </p>
                  <a 
                    href="/resume.pdf" 
                    download
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      Download PDF
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back Navigation */}
          <div className="text-center">
            <Link href="/">
              <Button variant="ghost" size="lg">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border mt-12">
        <div className="max-w-5xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 Sayan K Ghosh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}