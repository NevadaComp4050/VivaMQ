"use client"

import { useState, useEffect } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { useRouter } from "next/navigation"
import createApiClient from "~/lib/api-client"
import { useSession } from "next-auth/react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

type Rubric = {
  id: string
  title: string
  status: string
  createdAt: string
}

export default function ListRubricsPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchRubrics = async () => {
      if (!session?.user?.accessToken) return

      const apiClient = createApiClient(session.user.accessToken)
      try {
        const response = await apiClient.get("rubrics/")
        setRubrics(response.data.data)
      } catch (error) {
        console.error("Failed to fetch rubrics:", error)
        setError("Failed to load rubrics. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRubrics()
  }, [session])

  const handleCreateRubric = () => {
    router.push("/dashboard/rubrics/create")
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Rubrics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rubrics</CardTitle>
          <Button onClick={handleCreateRubric}>Create New Rubric</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rubrics.map((rubric) => (
                  <TableRow key={rubric.id}>
                    <TableCell className="font-medium">{rubric.title}</TableCell>
                    <TableCell>{rubric.status}</TableCell>
                    <TableCell>{new Date(rubric.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/dashboard/rubrics/${rubric.id}`)}
                      >
                        View
                      </Button>
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