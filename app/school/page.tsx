"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Rocket, Sparkles, BookOpen, Globe, Award, ChevronRight, Menu, Zap, Lightbulb, Heart, TrendingUp, Palette, Users, Check, Crown, X, Building, GraduationCap, BookText, Target, Calendar, Clock, Shield, Mail, Phone, MapPin } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";


// RegistrationForm component (same as before)
function RegistrationForm({ isOpen, onClose, planType }: { isOpen: boolean; onClose: () => void; planType: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-card border-border p-6 max-w-md w-full rounded-lg shadow-glow">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary">
            Register for {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
          </CardTitle>
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
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

export default function SchoolsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [activeTab, setActiveTab] = useState("curriculum");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleRegistration = (planType: string) => {
    setSelectedPlan(planType);
    setShowRegistrationForm(true);
  };

  const curriculumData = {
    elementary: [
      { title: "Digital Literacy Basics", description: "Introduction to computers, internet safety, and basic digital tools" },
      { title: "Creative Thinking", description: "Problem-solving through games and interactive activities" },
      { title: "Financial Fundamentals", description: "Basic money concepts through storytelling and games" },
      { title: "Emotional Intelligence", description: "Identifying and managing emotions through guided activities" }
    ],
    middle: [
      { title: "Coding Foundations", description: "Introduction to programming concepts with block-based coding" },
      { title: "Entrepreneurship Basics", description: "Simple business concepts through project-based learning" },
      { title: "AI Awareness", description: "Understanding what AI is and how it impacts daily life" },
      { title: "Communication Skills", description: "Developing presentation and teamwork abilities" }
    ],
    high: [
      { title: "Advanced Programming", description: "Python, web development, and app creation" },
      { title: "Business Planning", description: "Developing business models and marketing strategies" },
      { title: "AI Applications", description: "Hands-on projects with machine learning and data analysis" },
      { title: "Leadership Development", description: "Team management, project planning, and execution" }
    ]
  };

  const pricingPlans = [
    {
      title: "Starter",
      price: "400DT",
      period: "per student/year",
      description: "Perfect for schools starting their digital transformation journey",
      features: [
        "AI course access",
        "Basic progress tracking",
        "Teacher training resources",
        "Standard support",
        "Up to 500 students"
      ],
      cta: "Get Started"
    },
    {
      title: "Advanced",
      originalPrice: "1500DT",
      price: "800DT",
      period: "per student/year",
      description: "Comprehensive package for schools committed to digital literacy",
      features: [
        "AI & Business courses",
        "Advanced analytics dashboard",
        "Priority teacher training",
        "Dedicated account manager",
        "Custom implementation plan",
        "Parent engagement portal",
        "Up to 2000 students"
      ],
      popular: true,
      discount: "47% OFF",
      cta: "Get Started"
    },
    {
      title: "Enterprise",
      price: "Custom",
      period: "enterprise pricing",
      description: "Tailored solution for large districts and educational networks",
      features: [
        "Custom curriculum development",
        "District-wide deployment",
        "API integration",
        "White-label options",
        "24/7 premium support",
        "On-site training sessions",
        "Unlimited students"
      ],
      cta: "Contact Sales"
    }
  ];

  const benefits = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Future-Ready Curriculum",
      description: "Comprehensive program covering AI, business, and emotional intelligence"
    },
    {
      icon: <BookText className="w-8 h-8" />,
      title: "Teacher Resources",
      description: "Lesson plans, training materials, and ongoing professional development"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Detailed analytics on student performance and skill development"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe Environment",
      description: "safe networking platform with robust privacy and security measures"
    }
  ];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


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
                  <Link href="#contact" className="flex items-center">
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
                      <p className="font-bold text-primary">2+</p>
                      <p className="text-sm text-muted-foreground">Schools</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/10 border-secondary/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                        <GraduationCap className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <p className="font-bold text-secondary">30+</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <p className="font-bold text-accent">2+</p>
                      <p className="text-sm text-muted-foreground">Courses</p>
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

      {/* Benefits Section */}
      <section id="features" className="py-16 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-4">Why Schools Choose Bloolabb</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Our platform is designed specifically for educational institutions with features that support both teachers and students.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-background border-border text-center hover:shadow-glow transition-smooth">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-16 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-4">Comprehensive Curriculum</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Our curriculum is aligned with educational standards and designed for different age groups.
          </p>
          
          <div className="flex border-b border-border mb-8">
            <button 
              className={`px-6 py-3 font-semibold ${activeTab === "curriculum" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("curriculum")}
            >
              Curriculum Overview
            </button>
            <button 
              className={`px-6 py-3 font-semibold ${activeTab === "standards" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("standards")}
            >
              Standards Alignment
            </button>
            <button 
              className={`px-6 py-3 font-semibold ${activeTab === "resources" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
              onClick={() => setActiveTab("resources")}
            >
              Teacher Resources
            </button>
          </div>
          
          {activeTab === "curriculum" && (
            <div className="space-y-12">
              {/* <div>
                <h3 className="text-2xl font-bold text-primary mb-6">Elementary School (Ages 9-11)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {curriculumData.elementary.map((item, index) => (
                    <Card key={index} className="bg-card border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div> */}
              
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">Middle School (Ages 9-14)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {curriculumData.middle.map((item, index) => (
                    <Card key={index} className="bg-card border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-primary mb-6">High School (Ages 15-18)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {curriculumData.high.map((item, index) => (
                    <Card key={index} className="bg-card border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "standards" && (
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-bold text-primary mb-6">Standards Alignment</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">International Standards</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>ISTE Standards for Students</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>UN Sustainable Development Goals</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>P21 Framework for 21st Century Learning</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Regional Standards</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>World Education Standards</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>GCC Common Curriculum Framework</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0" />
                      <span>Custom alignment available for your region</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "resources" && (
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-bold text-primary mb-6">Comprehensive Teacher Resources</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <BookText className="w-5 h-5 text-primary mr-2" />
                    Lesson Plans
                  </h4>
                  <p className="text-muted-foreground">
                    Detailed, step-by-step lesson plans with learning objectives, materials needed, and timing.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="w-5 h-5 text-primary mr-2" />
                    Scope & Sequence
                  </h4>
                  <p className="text-muted-foreground">
                    Year-long planning guides with weekly topics and progression recommendations.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 text-primary mr-2" />
                    Professional Development
                  </h4>
                  <p className="text-muted-foreground">
                    Training sessions, workshops, and ongoing support for teachers implementing our curriculum.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="py-16 px-6 bg-card">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Choose the plan that works best for your institution. Volume discounts available for large districts.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 ${plan.popular ? "border-primary shadow-glow" : "border-border"} h-full flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                  <div className="my-4">
                    {plan.originalPrice && (
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                        {plan.discount && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {plan.discount}
                          </Badge>
                        )}
                      </div>
                    )}
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-primary mr-2 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button 
                    className={`w-full ${plan.popular ? "bg-primary" : "bg-secondary"} hover:opacity-90 rounded-full`}
                    onClick={() => plan.title === "Enterprise" ? window.location.href = "#contact" : handleRegistration(plan.title.toLowerCase())}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Need a custom solution? <Link href="#contact" className="text-primary font-semibold hover:underline">Contact our education team</Link>
            </p>
          </div>
        </div>
      </section> */}

      {/* Implementation Section */}
      <section className="py-16 px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-primary mb-4">Easy Implementation</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            We make it simple to integrate Bloolabb into your existing programs and systems.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quick Setup</h3>
              <p className="text-muted-foreground">
                Get started in less than 48 hours with our streamlined onboarding process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Integration</h3>
              <p className="text-muted-foreground">
                Single Sign-On (SSO) and secure data practices compliant with educational regulations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ongoing Support</h3>
              <p className="text-muted-foreground">
                Dedicated account management and support team to ensure success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-linear-to-br from-background via-primary/5 to-accent/10">
  <div className="container mx-auto max-w-6xl">
    <div className="text-center mb-16">
      <Badge variant="outline" className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
        <Mail className="w-4 h-4 mr-2" />
        Get In Touch
      </Badge>
      <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">Let's Transform Your School Together</h2>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Ready to bring future-ready skills to your institution? Our education specialists are here to help you every step of the way.
      </p>
    </div>
    
    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/*Contact Form */}
      <div className="relative">
        <div className="absolute -inset-3 bg-gradient-primary rounded-2xl opacity-20 blur-md"></div>
        <Card className="relative bg-background/80 backdrop-blur-sm border-border/50 p-8 shadow-glow">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <Rocket className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary bg-clip-text ">
              Request a Personalized Demo
            </CardTitle>
            <CardDescription className="text-lg">
              See how Bloolabb can transform learning at your institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setSubmissionError(null);

              const formData = new FormData(e.currentTarget);
              const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                school: formData.get('school'),
                role: formData.get('role'),
                students: formData.get('students'),
                message: formData.get('message')
              };

              try {
                const response = await fetch('/api/schools/demo-request', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data)
                });

                if (!response.ok) {
                  const error = await response.json();
                  throw new Error(error.message || 'Failed to submit demo request');
                }

                // Reset form
                e.currentTarget.reset();

                // Show success message (you can replace this with a toast notification)
                alert('Thank you! Our team will contact you shortly.');

              } catch (error) {
                setSubmissionError(error instanceof Error ? error.message : 'Something went wrong');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground/80">First Name *</label>
                  <input 
                    type="text" 
                    name="firstName"
                    id="firstName" 
                    className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                    required 
                    placeholder="Enter your first name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground/80">Last Name *</label>
                  <input 
                    type="text" 
                    name="lastName"
                    id="lastName" 
                    className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                    required 
                    placeholder="Enter your last name"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground/80">Email Address *</label>
                <input 
                  type="email"
                  name="email" 
                  id="email" 
                  className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  required 
                  placeholder="your.email@school.edu"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="school" className="text-sm font-medium text-foreground/80">School Name *</label>
                <input 
                  type="text"
                  name="school" 
                  id="school" 
                  className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  required 
                  placeholder="Enter your school name"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-foreground/80">Your Role *</label>
                <select 
                  name="role"
                  id="role" 
                  className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none" 
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select your role</option>
                  <option value="teacher">Teacher</option>
                  <option value="administrator">Administrator</option>
                  <option value="technology">Technology Director</option>
                  <option value="curriculum">Curriculum Director</option>
                  <option value="principal">Principal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="students" className="text-sm font-medium text-foreground/80">Number of Students</label>
                <select 
                  name="students"
                  id="students" 
                  className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none" 
                  disabled={isSubmitting}
                >
                  <option value="">Select range</option>
                  <option value="1-100">1-100 students</option>
                  <option value="101-500">101-500 students</option>
                  <option value="501-1000">501-1,000 students</option>
                  <option value="1001-2000">1,001-2,000 students</option>
                  <option value="2000+">2,000+ students</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground/80">Message (Optional)</label>
                <textarea 
                  name="message"
                  id="message" 
                  rows={4} 
                  className="w-full p-3.5 rounded-xl bg-muted/50 text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all" 
                  placeholder="Tell us about your specific needs or questions..."
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {submissionError && (
                <div className="p-3 text-sm text-red-500 bg-red-100 rounded-lg">
                  {submissionError}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-gradient-secondary text-primary-foreground font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Request Demo
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Contact Information */}
      <div className="space-y-8">
        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card border-border/50 p-5 hover:shadow-glow transition-smooth">
            <CardContent className="p-0 flex items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Email Us</h4>
                <p className="text-muted-foreground mt-1">schools@bloolabb.com</p>
                <p className="text-sm text-primary mt-2">Typically reply within 24 hours</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border/50 p-5 hover:shadow-glow transition-smooth">
            <CardContent className="p-0 flex items-start">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Call Us</h4>
                <p className="text-muted-foreground mt-1">+216 26 616 500</p>
                <p className="text-sm text-primary mt-2">Mon-Fri, 9AM-5PM GST</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Location Card */}
        <Card className="bg-card border-border/50 p-5 hover:shadow-glow transition-smooth">
          <CardContent className="p-0 flex items-start">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Our Location</h4>
              <p className="text-muted-foreground mt-1">Dubai, UAE</p>
              <p className="text-sm text-primary mt-2">Serving schools globally</p>
            </div>
          </CardContent>
        </Card>
        
        {/* FAQ Section */}
        <Card className="bg-card border-border/50 p-6">
          <CardHeader className="p-0 pb-5">
            <CardTitle className="text-xl font-bold flex items-center">
              <Sparkles className="w-5 h-5 text-primary mr-2" />
              Common Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-5">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                How long does implementation take?
              </h4>
              <p className="text-muted-foreground text-sm pl-5">Most schools are up and running within 1-2 weeks, depending on class size and technical requirements.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Do you provide teacher training?
              </h4>
              <p className="text-muted-foreground text-sm pl-5">Yes, we offer comprehensive training sessions and ongoing professional development for educators.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Can we try before purchasing?
              </h4>
              <p className="text-muted-foreground text-sm pl-5">Absolutely! We offer free pilot programs for qualified schools.</p>
            </div>
            
        
          </CardContent>
        </Card>
        
        {/* Success Metrics */}
        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
          <h4 className="font-bold text-primary mb-4 text-center">Why Schools Love Bloolabb</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-primary">95%</div>
              <div className="text-xs text-muted-foreground">Teacher Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">93%</div>
              <div className="text-xs text-muted-foreground">Student Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">2-3x</div>
              <div className="text-xs text-muted-foreground">Faster Implementation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-primary">24/7</div>
              <div className="text-xs text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ready to Transform Your School?</h2>
          <p className="text-lg mb-8 font-medium">
            Join hundreds of schools already preparing their students for the future with Bloolabb.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-secondary hover:bg-card hover:text-primary px-8 py-4 rounded-2xl font-semibold text-lg transition-smooth">
              <Link href="#contact" className="flex items-center">
                Request a Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
           
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-extrabold text-primary">bloolabb</span>
              </div>
              <p className="text-muted-foreground text-sm font-medium">Empowering learners with AI and business education through interactive challenges.</p>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-secondary font-medium transition-smooth">Home</Link></li>
                <li><Link href="#features" className="hover:text-secondary font-medium transition-smooth">Features</Link></li>
                <li><Link href="#curriculum" className="hover:text-secondary font-medium transition-smooth">Curriculum</Link></li>
                <li><Link href="#pricing" className="hover:text-secondary font-medium transition-smooth">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-secondary font-medium transition-smooth">Help Center</Link></li>
                <li><Link href="#contact" className="hover:text-secondary font-medium transition-smooth">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-primary mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-secondary font-medium transition-smooth">About Us</Link></li>
                <li><Link href="/privacy" className="hover:text-secondary font-medium transition-smooth">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
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