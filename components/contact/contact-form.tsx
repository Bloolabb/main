"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ContactFormProps {
  className?: string
}

export default function ContactForm({ className }: ContactFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
    phone: "",
  })

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return false
    const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email)
    return emailOk
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast({ title: "Check your inputs", description: "Name, valid email, and message are required.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Submission failed")
      toast({ title: "Message sent", description: "Thanks! We’ll get back to you shortly." })
      setForm({ name: "", email: "", subject: "", message: "", company: "", phone: "" })
    } catch (err: any) {
      toast({ title: "Couldn’t send message", description: err.message || "Please try again later.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input value={form.name} onChange={update("name")} placeholder="Your full name" required />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company (optional)</label>
                  <Input value={form.company} onChange={update("company")} placeholder="Company name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone (optional)</label>
                  <Input value={form.phone} onChange={update("phone")} placeholder="(+1) 555‑555‑5555" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input value={form.subject} onChange={update("subject")} placeholder="How can we help?" />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea value={form.message} onChange={update("message")} placeholder="Tell us a bit more..." rows={6} required />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Send className="h-4 w-4" />
                  {loading ? "Sending..." : "Send message"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Contact details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:support@bloolabb.com" className="hover:underline">support@bloolabb.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+15555555555" className="hover:underline">(+1) 555‑555‑5555</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Remote • Worldwide</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Response time</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">We typically reply within 1–2 business days.</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}