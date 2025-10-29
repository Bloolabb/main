import AboutPageClient from "@/components/about/page";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Sparkles, Lightbulb, Heart, Users } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Client Header */}
      <AboutPageClient />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-background via-primary/5 to-accent/10 pt-20">
          <div className="container mx-auto px-4 sm:px-6 relative z-10 py-12 sm:py-0">
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Our Story
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black leading-tight">
                  <span className="text-gradient-primary">About Bloolabb</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Empowering the next generation with future-ready skills through innovative learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold">Our Story</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Bloolabb was founded with a simple vision: to bridge the gap between traditional education
                and the rapidly evolving demands of the modern workforce. We believe every student deserves
                access to cutting-edge skills that prepare them for the careers of tomorrow.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Born from a passion for education and technology, our platform combines the best of interactive
                learning, gamification, and real-world application to create meaningful educational experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Rocket className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">Our Mission</h3>
                <p className="text-lg text-muted-foreground">
                  To democratize access to future-ready education by providing innovative, hands-on learning
                  experiences that equip students with the skills needed to thrive in the digital economy.
                </p>
              </div>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                  <Lightbulb className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">Our Vision</h3>
                <p className="text-lg text-muted-foreground">
                  A world where every learner has the opportunity to develop the technical and creative skills
                  needed to shape the future and drive meaningful change in their communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Innovation</h3>
                <p className="text-muted-foreground">
                  Constantly pushing boundaries to create cutting-edge learning experiences.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Community</h3>
                <p className="text-muted-foreground">
                  Building supportive networks where learners grow together.
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-lg bg-card border border-border">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Empathy</h3>
                <p className="text-muted-foreground">
                  Understanding and addressing the unique needs of every learner.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-linear-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6">Ready to Start Your Journey?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 font-medium px-4">
            Join a vibrant community mastering AI and business through interactive experiences.
          </p>
          <Button className="bg-secondary hover:bg-card hover:text-primary px-6 sm:px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-smooth">
            <Link href="/auth/sign-up" className="flex items-center">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
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
  );
}