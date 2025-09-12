import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json()

    const supabase = await createClient()

    const { data, error } = await supabase.rpc("add_admin_user", {
      user_email: email,
      admin_role: role,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to setup admin user" }, { status: 500 })
  }
}
