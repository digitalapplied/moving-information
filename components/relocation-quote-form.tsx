"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, InfoIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const formSchema = z.object({
  quote_option: z.string().min(1, { message: "Please select a quote option" }),
  survey_date: z.date().optional(),
  inventory_file: z.any().optional(),
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

type FormValues = z.infer<typeof formSchema>

export function RelocationQuoteForm() {
  const [charCount, setCharCount] = useState(0)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quote_option: "",
      item_list: "",
      move_type: "",
      nearest_branch: "",
      consignment_type: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      mobile: "",
      collection_address: "",
      collection_city: "",
      collection_province: "",
      collection_country: "",
      collection_postal_code: "",
      collection_location_type: "",
      delivery_address: "",
      delivery_city: "",
      delivery_province: "",
      delivery_country: "",
      delivery_postal_code: "",
      delivery_location_type: "",
      packing_service: "",
      insurance_value: "",
      storage_required: "",
      vehicle_transport: "",
      pet_relocation: "",
      paying_entity: "",
      additional_notes: "",
    },
  })

  const quoteOption = form.watch("quote_option")
  const itemList = form.watch("item_list")

  useEffect(() => {
    if (itemList) {
      setCharCount(itemList.length)
    }
  }, [itemList])

  function onSubmit(data: FormValues) {
    console.log(data)
    // Submit form data to your API
    alert("Form submitted successfully!")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name)
    }
  }

  return (
    <Card className="mx-auto max-w-4xl shadow-lg">
      <CardHeader className="flex items-center justify-center border-b pb-6">
        <Image
          src="https://www.biddulphs.co.za/wp-content/uploads/2021/12/Biddulphs-International-Logo.svg"
          alt="Biddulphs International Logo"
          width={250}
          height={80}
          priority
        />
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* 1. Move Details */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">1. Move Details</h2>

              <FormField
                control={form.control}
                name="quote_option"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Select Preferred Quote Option <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--- Please Select ---" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in_home_visit">Request An In-Home Visit</SelectItem>
                        <SelectItem value="upload_inventory">Upload An Inventory</SelectItem>
                        <SelectItem value="type_list">Type A List Of Your Items (for small consignments)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Field: Survey Date */}
              {quoteOption === "in_home_visit" && (
                <div className="border-t border-dashed pt-6">
                  <FormField
                    control={form.control}
                    name="survey_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <FormLabel className="font-semibold">
                            Survey Date <span className="text-red-500">*</span>
                          </FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">
                                  A representative will confirm availability to visit your premises to prepare an
                                  accurate moving quote.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>A representative will confirm availability.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Conditional Field: Upload Inventory */}
              {quoteOption === "upload_inventory" && (
                <div className="border-t border-dashed pt-6">
                  <p className="font-semibold">Complete and Upload Inventory List</p>
                  <p className="mb-4 text-sm text-gray-600">(find it as an attachment in our email)</p>
                  <FormField
                    control={form.control}
                    name="inventory_file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Upload Inventory List <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                              onChange={(e) => {
                                handleFileChange(e)
                                onChange(e.target.files?.[0] || null)
                              }}
                              {...fieldProps}
                            />
                            {selectedFile && <p className="text-sm text-gray-600">Selected: {selectedFile}</p>}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Conditional Field: Type List */}
              {quoteOption === "type_list" && (
                <div className="border-t border-dashed pt-6">
                  <FormField
                    control={form.control}
                    name="item_list"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Type a List of Your Items <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please list your items here..."
                            className="resize-y"
                            rows={6}
                            maxLength={5000}
                            {...field}
                          />
                        </FormControl>
                        <div className="text-right text-sm text-gray-500">{charCount} / 5000</div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="move_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Move Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--- Please Select ---" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="within_sa">Moving Within South Africa</SelectItem>
                        <SelectItem value="international">International Move</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nearest_branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Nearest Branch To Collection <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--- Please Select ---" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pretoria">Pretoria</SelectItem>
                        <SelectItem value="Johannesburg">Johannesburg</SelectItem>
                        <SelectItem value="Potchefstroom">Potchefstroom</SelectItem>
                        <SelectItem value="Bloemfontein">Bloemfontein</SelectItem>
                        <SelectItem value="Pietermaritzburg">Pietermaritzburg</SelectItem>
                        <SelectItem value="Durban">Durban</SelectItem>
                        <SelectItem value="Cape Town">Cape Town</SelectItem>
                        <SelectItem value="George">George</SelectItem>
                        <SelectItem value="Port Elizabeth">Port Elizabeth</SelectItem>
                        <SelectItem value="Harare">Harare</SelectItem>
                        <SelectItem value="Botswana">Botswana</SelectItem>
                        <SelectItem value="Pretoria Commercial">Pretoria Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consignment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Consignment Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--- Please Select ---" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="few_items">Just a few items</SelectItem>
                        <SelectItem value="1_bedroom">1 Bedroom</SelectItem>
                        <SelectItem value="2_bedroom">2 Bedroom</SelectItem>
                        <SelectItem value="3_bedroom">3 Bedroom</SelectItem>
                        <SelectItem value="4_plus_bedroom">4+ Bedroom</SelectItem>
                        <SelectItem value="office">Office Move</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="move_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-semibold">
                      Estimated Move Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 2. Contact Information */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">
                2. Contact Information
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Phone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your primary phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your mobile number (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 3. Moving From */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">3. Moving From</h2>

              <FormField
                control={form.control}
                name="collection_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Collection Address (Street, Town)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main Street, Sandton" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="collection_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Collection City <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter collection city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collection_province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Collection State / Province <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--- Please Select ---" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Gauteng">Gauteng</SelectItem>
                          <SelectItem value="Western Cape">Western Cape</SelectItem>
                          <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                          <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                          <SelectItem value="Limpopo">Limpopo</SelectItem>
                          <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                          <SelectItem value="North West">North West</SelectItem>
                          <SelectItem value="Free State">Free State</SelectItem>
                          <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="collection_country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Collection Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--- Please Select ---" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ZA">South Africa</SelectItem>
                          <SelectItem value="BW">Botswana</SelectItem>
                          <SelectItem value="ZW">Zimbabwe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collection_postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Collection Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="collection_location_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-semibold">
                      Collection Type Of Location <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="house" />
                          </FormControl>
                          <FormLabel className="font-normal">A Free-Standing House</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="townhouse" />
                          </FormControl>
                          <FormLabel className="font-normal">Townhouse / Villa / Unit / Estate</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="apartment" />
                          </FormControl>
                          <FormLabel className="font-normal">Apartment / Flat</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="office" />
                          </FormControl>
                          <FormLabel className="font-normal">Office Building</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 4. Moving To */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">4. Moving To</h2>

              <FormField
                control={form.control}
                name="delivery_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Delivery Address (Street, Town)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 456 Beach Road, Cape Town" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="delivery_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Delivery City <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter delivery city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Delivery State / Province <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--- Please Select ---" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Gauteng">Gauteng</SelectItem>
                          <SelectItem value="Western Cape">Western Cape</SelectItem>
                          <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                          <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                          <SelectItem value="Limpopo">Limpopo</SelectItem>
                          <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                          <SelectItem value="North West">North West</SelectItem>
                          <SelectItem value="Free State">Free State</SelectItem>
                          <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="delivery_country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Delivery Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="--- Please Select ---" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ZA">South Africa</SelectItem>
                          <SelectItem value="BW">Botswana</SelectItem>
                          <SelectItem value="ZW">Zimbabwe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Delivery Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="delivery_location_type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-semibold">
                      Delivery Type Of Location <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="house" />
                          </FormControl>
                          <FormLabel className="font-normal">A Free-Standing House</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="townhouse" />
                          </FormControl>
                          <FormLabel className="font-normal">Townhouse / Villa / Unit / Estate</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="apartment" />
                          </FormControl>
                          <FormLabel className="font-normal">Apartment / Flat</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="office" />
                          </FormControl>
                          <FormLabel className="font-normal">Office Building</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 5. Packing */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">5. Packing</h2>

              <FormField
                control={form.control}
                name="packing_service"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-semibold">Packing Service Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="full" />
                          </FormControl>
                          <FormLabel className="font-normal">Full Packing Service</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="breakables" />
                          </FormControl>
                          <FormLabel className="font-normal">Packing Of Breakables Only</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="supply_materials" />
                          </FormControl>
                          <FormLabel className="font-normal">Supply Packing Materials</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="self_pack" />
                          </FormControl>
                          <FormLabel className="font-normal">Self Pack / Own Materials</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 6. Insurance */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">6. Insurance</h2>

              <FormField
                control={form.control}
                name="insurance_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Consignment Value For "All Risks" In-Transit Insurance
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter estimated value (e.g., R 50000)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 7. Storage */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">7. Storage</h2>

              <FormField
                control={form.control}
                name="storage_required"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-semibold">Would You Require Storage For Your Consignment?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 8. Additional Services */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">
                8. Additional Services
              </h2>

              <FormField
                control={form.control}
                name="vehicle_transport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      If Vehicle Transportation Is Required, Please Specify
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1 x Toyota Hilux" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pet_relocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">If Pet Relocation Is Required, Please Specify</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2 x Medium Dogs, 1 x Cat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 9. Account Information */}
            <div className="space-y-6">
              <h2 className="border-b border-[#056130] pb-2 text-xl font-bold text-[#056130]">
                9. Account Information
              </h2>

              <FormField
                control={form.control}
                name="paying_entity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Who Is Paying For Your Move?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--- Please Select ---" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="company">Your Company</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additional_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Additional Relocation Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other important details? (e.g., difficult access, specific items, preferred contact times)"
                        className="resize-y"
                        rows={5}
                        maxLength={5000}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="bg-[#056130] px-8 py-3 text-lg font-bold uppercase tracking-wider hover:bg-[#044a25]"
            >
              GET MY QUOTE
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
