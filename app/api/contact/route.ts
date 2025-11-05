import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message, company, phone } = body || {}

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const receivedAt = new Date().toISOString()

    const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"]
    const hasSMTP = required.every((k) => process.env[k])
    const to = process.env.CONTACT_TO || "contact@ali-cheikh.com"

    // Try Resend first if configured (no SMTP required)
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      const resend = new Resend(resendApiKey)
      try {
        await resend.emails.send({
          from: process.env.CONTACT_FROM || "onboarding@resend.dev",
          to,
          subject: subject || "Contact Form Submission",
          text: message,
          html: `<p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
                 ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
                 <p><strong>Message:</strong></p>
                 <p>${message.replace(/\n/g, "<br>")}</p>`,
        })
        return NextResponse.json({ success: true, receivedAt, via: "resend" })
      } catch (resendErr: any) {
        console.error("[contact] Resend send failed", resendErr)
        // If SMTP is available, fall back to nodemailer, else acknowledge in dev
        if (!hasSMTP && process.env.NODE_ENV !== "production") {
          return NextResponse.json({ success: true, receivedAt, emailError: resendErr?.message, via: "resend-failed-dev-ack" })
        }
        // otherwise continue to SMTP branch below
      }
    }

    if (hasSMTP) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      })

      try {
        await transporter.sendMail({
          from: `"${name}" <${email}>`,
          to,
          subject: subject || "Contact Form Submission",
          text: message,
          html: `<p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
                 ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
                 <p><strong>Message:</strong></p>
                 <p>${message.replace(/\n/g, "<br>")}</p>`,
        })
        return NextResponse.json({ success: true, receivedAt, via: "smtp" })
      } catch (mailErr: any) {
        console.error("[contact] SMTP send failed", mailErr)
        if (process.env.NODE_ENV !== "production") {
          return NextResponse.json({ success: true, receivedAt, emailError: mailErr?.message, via: "smtp-failed-dev-ack" })
        }
        return NextResponse.json({ error: "Email send failed" }, { status: 500 })
      }
    }

    // Neither Resend nor SMTP configured; acknowledge in dev, error in production
    if (process.env.NODE_ENV !== "production") {
      console.warn("[contact] No email provider configured; dev ack.")
      console.log("[contact] submission", { name, email, subject, message, company, phone, receivedAt })
      return NextResponse.json({ success: true, receivedAt, via: "none-dev-ack" })
    }
    return NextResponse.json({ error: "Email provider not configured" }, { status: 500 })

    return NextResponse.json({ success: true, receivedAt })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 })
  }
}