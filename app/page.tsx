"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Rocket, Sparkles, BookOpen, Globe, Award, ChevronRight, Star, Zap, Lightbulb, Heart, TrendingUp, Palette, Users, Check, Crown, X, Menu } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import heroImage from "@/assets/hero-image.webp";
import Image from "next/image";

// Define types for our color mapping
type ColorType = "primary" | "secondary" | "accent";

interface ColorMapItem {
  bg: string;
  text: string;
  dot: string;
}

interface ColorMap {
  primary: ColorMapItem;
  secondary: ColorMapItem;
  accent: ColorMapItem;
}

// Color mapping for static class names
const colorMap: ColorMap = {
  primary: {
    bg: "bg-linear-primary",
    text: "text-primary-foreground",
    dot: "bg-primary"
  },
  secondary: {
    bg: "bg-linear-secondary", 
    text: "text-secondary-foreground",
    dot: "bg-secondary"
  },
  accent: {
    bg: "bg-linear-accent",
    text: "text-accent-foreground", 
    dot: "bg-accent"
  }
};

// Placeholder RegistrationForm component (replace with actual implementation)
function RegistrationForm({ isOpen, onClose, planType }: { isOpen: boolean; onClose: () => void; planType: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border p-4 sm:p-6 max-w-md w-full rounded-lg shadow-glow">
        <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
            Register for {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
          </CardTitle>
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground p-2">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-muted-foreground mb-4">Sign up to start your free trial!</p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 rounded-md bg-muted text-foreground border border-input focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 rounded-md bg-muted text-foreground border border-input focus:ring-2 focus:ring-primary"
            />
            <Button className="w-full bg-primary hover:bg-secondary text-primary-foreground rounded-full">
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface LpgccItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: ColorType;
  benefits: string[];
}

const lpgccItems: LpgccItem[] = [
  {
    id: "learn",
    title: "Learn",
    icon: BookOpen,
    description: "Bite-sized courses on business, tech, and life skills",
    color: "primary",
    benefits: ["Business fundamentals", "Coding basics", "Financial literacy", "Communication skills"],
  },
  {
    id: "play",
    title: "Play",
    icon: Brain,
    description: "Gamified lessons and simulators to boost retention",
    color: "secondary",
    benefits: ["XP & leveling system", "Achievement badges", "Learning streaks", "Multiplayer challenges"],
  },
  {
    id: "grow",
    title: "Grow",
    icon: TrendingUp,
    description: "Develop confidence, teamwork, and emotional intelligence",
    color: "primary",
    benefits: ["Confidence building", "Emotional regulation", "Leadership skills", "Self-reflection"],
  },
  {
    id: "create",
    title: "Create",
    icon: Palette,
    description: "Build real-world projects with household materials or kits",
    color: "secondary",
    benefits: ["DIY projects", "App prototypes", "Art & design", "Innovation challenges"],
  },
  {
    id: "connect",
    title: "Connect",
    icon: Users,
    description: "A safe online space to share progress, wins, and stories",
    color: "primary",
    benefits: ["Global community", "Project sharing", "Peer mentoring", "Safe interactions"],
  },
];

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRegistration = (planType: string) => {
    setSelectedPlan(planType);
    setShowRegistrationForm(true);
  };

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

     {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-background via-primary/5 to-accent/10 pt-20">
        {/* Floating decoration elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float hidden sm:block">
            <Sparkles className="w-8 h-8 text-primary opacity-60" />
          </div>
          <div className="absolute top-40 right-20 animate-float hidden sm:block" style={{ animationDelay: '1s' }}>
            <Star className="w-6 h-6 text-warning opacity-50" />
          </div>
          <div className="absolute bottom-40 left-20 animate-float hidden sm:block" style={{ animationDelay: '2s' }}>
            <Zap className="w-10 h-10 text-accent opacity-40" />
          </div>
          <div className="absolute bottom-20 right-10 animate-float hidden sm:block" style={{ animationDelay: '1.5s' }}>
            <Rocket className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 py-12 sm:py-0">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  Over 3,000+ Future Founders Waiting
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black leading-tight">
                  <span className="text-linear-primary">
                    Empower Your Child
                  </span>
                  <br />
                  <span className="text-foreground">
                    with Future-Ready
                  </span>
                  <br />
                  <span className="text-linear-secondary">
                    Skills
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Business, Tech, Creativity & Emotional Intelligence — All in One 
                  <span className="font-bold text-primary"> user friendly</span> Platform
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 rounded-full text-base sm:text-lg font-bold transition-all">
                  <Link href="/auth/sign-up" className="flex items-center">
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse-fun" />
                    Start now
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse-fun"></div>
                  Ages 6-18
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-fun"></div>
                  Cancel Anytime
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse-fun"></div>
                  AI-Powered
                </div>
              </div>
            </div>

            {/* Right side - Hero image */}
            <div className="relative mt-8 lg:mt-0">
              <div className="relative">
                <Image
                  src={heroImage}
                  alt="Kids learning with Bloolabb platform"
                  className="w-full h-auto rounded-2xl shadow-primary hover:shadow-glow transition-smooth"
                />
                
                {/* Floating achievement badges */}
                <div className="absolute -top-4 -left-4 bg-linear-success text-primary-foreground px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-glow">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Level Up!
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-secondary text-primary-foreground px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-glow">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  +50 XP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 bg-card">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-primary mb-8 sm:mb-12">Why Choose bloolabb ?</h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <Card className="bg-card border-border shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Interactive AI Learning</CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium">Master AI concepts through engaging simulations and hands-on activities.</p>
                </div>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Business Challenges</CardTitle>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium">Develop entrepreneurial skills by tackling real-world business scenarios.</p>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* LPGCC Section */}
      <section id="lpgcc" className="py-12 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-20">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xs sm:text-sm">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                Our Secret Sauce
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                Our Proven Learning Method:
                <br />
                <span className="text-primary">LPGCC</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
                LPGCC is our unique approach, blending <span className="font-bold text-primary">IQ</span>,
                <span className="font-bold text-accent"> EQ</span>, and
                <span className="font-bold text-secondary"> creativity</span> to make learning fun and effective.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 max-w-3xl mx-auto px-4">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-base">
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                Boosts IQ
              </div>
              <div className="flex items-center gap-2 bg-accent/10 text-accent px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-base">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                Develops EQ
              </div>
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-base">
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
                Sparks Creativity
              </div>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {lpgccItems.map((item, index) => {
              const IconComponent = item.icon;
              const colorData = colorMap[item.color];
              
              return (
                <Card
                  key={item.id}
                  className="group h-full bg-card border-border hover:shadow-glow transition-smooth"
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full ${colorData.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow`}>
                      <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 text-orange`} />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-smooth">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                      {item.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground">Key Features:</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {item.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-1 justify-center">
                            <div className={`w-1.5 h-1.5 rounded-full ${colorData.dot}`} />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 sm:p-8 md:p-12 mb-8 sm:mb-12">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Why <span className="text-secondary">LPGCC</span> Works
                </h3>
                <div className="space-y-4 text-muted-foreground text-sm sm:text-base">
                  <p className="leading-relaxed">
                    Traditional education focuses only on knowledge transfer. LPGCC integrates
                    emotional intelligence, creativity, and real-world application for holistic growth.
                  </p>
                  <p className="leading-relaxed">
                    Each component builds on the others: <strong>Learn</strong> provides foundation,
                    <strong> Play</strong> reinforces engagement, <strong> Grow</strong> builds character,
                    <strong> Create</strong> applies knowledge, and <strong> Connect</strong> fosters community.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              Ready to Transform Your Learning?
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Join a community mastering AI and business through interactive challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="group bg-linear-primary hover:bg-linear-secondary text-primary-foreground px-6 py-4 rounded-full text-base sm:text-lg font-semibold transition-smooth">
                <Link href="/auth/sign-up" className="flex items-center">
                  Join Now
                  <Rocket className="w-5 h-5 ml-2 group-hover:animate-pulse-fun" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-12 sm:py-16 px-4 sm:px-6 bg-card">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-primary mb-8 sm:mb-12">Our Courses</h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {[
              { title: "AI Essentials", desc: "Learn AI fundamentals through engaging challenges.", icon: Brain },
              { title: "Entrepreneurship 101", desc: "Master business skills with real-world scenarios.", icon: Rocket },
            ].map((course, index) => {
              const IconComponent = course.icon;
              
              return (
                <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-smooth">
                  <CardHeader>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-primary text-center">{course.title}</CardTitle>
                    <p className="text-sm sm:text-base text-muted-foreground text-center font-medium">{course.desc}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
              About <span className="text-primary/30">bloolabb</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Born from a vision to revolutionize education and prepare the next generation for tomorrow's challenges
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">Our Founder's Journey</h3>
              <div className="space-y-4 text-muted-foreground text-sm sm:text-base">
                <p>
                  <strong className="text-foreground">Mohamed Zouari</strong> founded bloolabb after witnessing the gap between traditional education and the skills needed for the future.
                </p>
                <p>
                  Growing up between Tunisia and observing educational systems worldwide, Mohamed realized that learners weren't being prepared for the rapidly evolving digital economy.
                </p>
                <p>
                  His vision: Create a learning platform that combines technology, psychology, and real-world application to develop confident, creative, and emotionally intelligent leaders.
                </p>
              </div>
            </div>
            <Card className="p-6 sm:p-8 bg-card border-border shadow-card hover:shadow-glow transition-smooth">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-linear-primary flex items-center justify-center text-primary-foreground text-xl sm:text-2xl font-bold">
                  MZ
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-primary">Mohamed Zouari</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Founder & CEO</p>
                <p className="text-xs sm:text-sm italic text-muted-foreground">"AI is the new literacy. Teaching your kid AI means preparing them to shape the future."</p>
              </div>
            </Card>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            <Card className="p-6 sm:p-8 bg-card border-border shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="text-center p-0 mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-linear-primary flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-primary">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  To empower learners with essential AI, business, and life skills through our innovative LPGCC methodology, creating confident, creative, and future-ready leaders.
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 sm:p-8 bg-card border-border shadow-card hover:shadow-glow transition-smooth">
              <CardHeader className="text-center p-0 mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-linear-secondary flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-primary">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-0">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  To become the leading EdTech platform globally, starting in Tunisia and expanding to UAE and beyond, transforming how learners prepare for tomorrow's economy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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

      <RegistrationForm
        isOpen={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        planType={selectedPlan || ""}
      />
    </div>
  );
}