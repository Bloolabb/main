"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/language-selector";

export default function AboutPageClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>  {/* Header */}
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
            <Link href="/#lpgcc" className="text-foreground hover:text-secondary font-semibold transition-smooth text-sm lg:text-base">
              How It Works
            </Link>
            <Link href="/#courses" className="text-foreground hover:text-secondary font-semibold transition-smooth text-sm lg:text-base">
              Courses
            </Link>
            <Link href="/about" className="text-foreground hover:text-secondary font-semibold transition-smooth text-sm lg:text-base">
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
              <Link href="#lpgcc" className="text-foreground hover:text-secondary font-semibold transition-smooth" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="#courses" className="text-foreground hover:text-secondary font-semibold transition-smooth" onClick={() => setMobileMenuOpen(false)}>
                Courses
              </Link>
              <Link href="#about" className="text-foreground hover:text-secondary font-semibold transition-smooth" onClick={() => setMobileMenuOpen(false)}>
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
    </>
  );
}