"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface QuoteSubmission {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  move_type: string
  consignment_type: string
  move_date: string
  created_at: string
  status: string
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<QuoteSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const response = await fetch("/api/submissions")
        if (!response.ok) {
          throw new Error("Failed to fetch submissions")
        }
        const data = await response.json()
        setSubmissions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching submissions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Quote Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#056130]" />
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : submissions.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No submissions found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Move Type</TableHead>
                  <TableHead>Consignment</TableHead>
                  <TableHead>Move Date</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.first_name} {submission.last_name}
                    </TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.phone}</TableCell>
                    <TableCell>{submission.move_type}</TableCell>
                    <TableCell>{submission.consignment_type}</TableCell>
                    <TableCell>{format(new Date(submission.move_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(submission.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.status === "pending"
                            ? "outline"
                            : submission.status === "contacted"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
