"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            Sayan Ghosh
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/highlights" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/highlights" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Highlights
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/contact" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/highlights" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/highlights" ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Highlights
              </Link>
              <Link 
                href="/contact" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/contact" ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}