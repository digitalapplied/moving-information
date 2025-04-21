"use server"

import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase"

// Define the form schema for validation
const formSchema = z.object({
  quote_option: z.string().min(1, { message: "Please select a quote option" }),
  survey_date: z.date().optional(),
  inventory_file_name: z.string().optional(),
  item_list: z.string().max(5000).optional(),
  move_type: z.string().min(1, { message: "Please select a move type" }),
  nearest_branch: z.string().min(1, { message: "Please select a branch" }),
  consignment_type: z.string().min(1, { message: "Please select a consignment type" }),
  move_date: z.date({ required_error: "Please select a date" }),
  first_name: z.string().min(1, { message: "Please enter your first name" }),
  last_name: z.string().min(1, { message: "Please enter your last name" }),
  phone: z.string().min(1, { message: "Please enter your phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  mobile: z.string().optional(),
  collection_address: z.string().optional(),
  collection_city: z.string().min(1, { message: "Please enter a collection city" }),
  collection_province: z.string().min(1, { message: "Please select a province" }),
  collection_country: z.string().min(1, { message: "Please select a country" }),
  collection_postal_code: z.string().optional(),
  collection_location_type: z.string().min(1, { message: "Please select a location type" }),
  delivery_address: z.string().optional(),
  delivery_city: z.string().min(1, { message: "Please enter a delivery city" }),
  delivery_province: z.string().min(1, { message: "Please select a province" }),
  delivery_country: z.string().min(1, { message: "Please select a country" }),
  delivery_postal_code: z.string().optional(),
  delivery_location_type: z.string().min(1, { message: "Please select a location type" }),
  packing_service: z.string().optional(),
  insurance_value: z.string().optional(),
  storage_required: z.string().optional(),
  vehicle_transport: z.string().optional(),
  pet_relocation: z.string().optional(),
  paying_entity: z.string().optional(),
  additional_notes: z.string().max(5000).optional(),
})

export type FormValues = z.infer<typeof formSchema>

export async function submitQuote(formData: FormValues) {
  try {
    // Validate the form data
    const validatedData = formSchema.parse(formData)

    // Format dates for Supabase
    const formattedData = {
      ...validatedData,
      survey_date: validatedData.survey_date ? validatedData.survey_date.toISOString().split("T")[0] : null,
      move_date: validatedData.move_date.toISOString().split("T")[0],
    }

    // Create Supabase client
    const supabase = createServerSupabaseClient()

    // Insert data into the quote_submissions table
    const { data, error } = await supabase.from("quote_submissions").insert([formattedData]).select()

    if (error) {
      console.error("Error submitting quote:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      data: data[0],
      message: "Your quote request has been submitted successfully! Our team will contact you shortly.",
    }
  } catch (error) {
    console.error("Error in submitQuote:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
