import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("quote_submissions")
      .select("id, first_name, last_name, email, phone, move_type, consignment_type, move_date, created_at, status")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching submissions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error in submissions API:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
