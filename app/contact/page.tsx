import ContactForm from "@/components/contact/contact-form"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";

export default function ContactPage() {
  return (
  <div>
          <header className="bg-card shadow-card fixed top-0 w-full z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-extrabold text-primary">bloolabb</span>
              </div>
              <nav className="hidden md:flex gap-8">
                <Link href="/" className="text-foreground hover:text-secondary font-semibold transition-smooth">
                  Home
                </Link>
                <Link href="#features" className="text-foreground hover:text-secondary font-semibold transition-smooth">
                  Features
                </Link>
                <Link href="#curriculum" className="text-foreground hover:text-secondary font-semibold transition-smooth">
                  Curriculum
                </Link>
                {/* <Link href="#pricing" className="text-foreground hover:text-secondary font-semibold transition-smooth">
                  Pricing
                </Link> */}
                <Link href="#contact" className="text-foreground hover:text-secondary font-semibold transition-smooth">
                  Contact
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                <LanguageSelector />
                <Button variant="ghost" className="text-foreground hover:bg-primary hover:text-primary-foreground font-semibold">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button className="bg-secondary hover:bg-primary text-secondary-foreground font-semibold rounded-full px-6">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </div>
            </div>
          </header>
    
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl font-bold">Contact us</h1>
        <p className="text-muted-foreground">Questions, feedback, or partnership ideas? We’d love to hear from you.</p>
      </div>
      <ContactForm />
    </div>
          <footer className="bg-muted py-8 sm:py-12 px-4 sm:px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-extrabold text-primary">bloolabb</span>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Empowering learners with AI and business education through interactive challenges.</p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-3 sm:mb-4 text-sm sm:text-base">Explore</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-secondary font-medium transition-smooth">Features</Link></li>
                <li><Link href="/courses" className="hover:text-secondary font-medium transition-smooth">Courses</Link></li>
                <li><Link href="/about" className="hover:text-secondary font-medium transition-smooth">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-secondary font-medium transition-smooth">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-secondary font-medium transition-smooth">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-3 sm:mb-4 text-sm sm:text-base">Company</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-secondary font-medium transition-smooth">About Us</Link></li>
                <li><Link href="/privacy" className="hover:text-secondary font-medium transition-smooth">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground font-medium">
            <p>&copy; 2025 bloolabb. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>

  )
}