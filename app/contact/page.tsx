"use client"

import { useState } from "react"
import ContactForm from "@/components/contact/contact-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu, Building, ArrowRight, Users, GraduationCap, BookOpen, Award } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="bg-card shadow-card fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold text-primary">bloolabb</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8">
            <Link href="#features" className="text-foreground hover:text-secondary font-semibold transition-smooth text-sm lg:text-base">
              Features
            </Link>
            <Link href="#lpgcc" className="text-foreground hover:text-secondary font-semibold transition-smooth text-sm lg:text-base">
              How It Works
            </Link>
            <Link href="#courses" className="text-foreground hover:text-secondary font-semibold transition-smooth text-sm lg:text-base">
              Courses
            </Link>
            <Link href="#about" className="text-foreground hover:text-secondary font-semibold transition-smooth text-sm lg:text-base">
              About
            </Link>
            <Link href="/school" className="text-foreground hover:text-secondary font-semibold transition-smooth text-sm lg:text-base">
              School
            </Link>
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <Button variant="ghost" className="text-foreground hover:bg-primary hover:text-primary-foreground font-semibold hidden lg:flex">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button className="bg-secondary hover:bg-primary text-secondary-foreground font-semibold rounded-full px-4 lg:px-6">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link href="#features" className="text-foreground hover:text-secondary font-semibold transition-smooth" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="https://bloolabb.com/#lpgcc" className="text-foreground hover:text-secondary font-semibold transition-smooth" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="https://bloolabb.com/#courses" className="text-foreground hover:text-secondary font-semibold transition-smooth" onClick={() => setMobileMenuOpen(false)}>
                Courses
              </Link>
              <Link href="https://bloolabb.com/about" className="text-foreground hover:text-secondary font-semibold transition-smooth" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/school" className="text-foreground hover:text-secondary font-semibold transition-smooth" onClick={() => setMobileMenuOpen(false)}>
                School
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <LanguageSelector />
                <Button variant="ghost" className="text-foreground hover:bg-primary hover:text-primary-foreground font-semibold justify-start">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button className="bg-secondary hover:bg-primary text-secondary-foreground font-semibold rounded-full">
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-linear-to-br from-primary/5 to-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                <Building className="w-4 h-4 mr-2" />
                For Schools & Districts
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Prepare Your Students for the <span className="text-primary">Digital Future</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive AI, business, and life skills curriculum designed for educational institutions. 
                Equip your students with future-ready skills through our innovative LPGCC methodology.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-semibold">
                  <Link href="https://bloolabb.com/contact" className="flex items-center">
                    Request a Demo <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                {/* <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-full font-semibold">
                  <Link href="#pricing" className="flex items-center">
                    View Pricing <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button> */}
              </div>
            </div>
            <div className="relative">
              <div className="bg-card p-8 rounded-2xl shadow-glow border border-border">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-primary/10 border-primary/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <p className="font-bold text-primary">5+</p>
                      <p className="text-sm text-muted-foreground">Certifications</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/10 border-secondary/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                        <GraduationCap className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <p className="font-bold text-secondary">1,000+</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <p className="font-bold text-accent">180+</p>
                      <p className="text-sm text-muted-foreground">Exercises</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-warning/10 border-warning/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="w-6 h-6 text-warning-foreground" />
                      </div>
                      <p className="font-bold text-warning">98%</p>
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    
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