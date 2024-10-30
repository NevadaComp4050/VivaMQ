"use client"

import { useState, useEffect, useCallback } from "react"
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
import { AlertCircle, Loader2, RefreshCw, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

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
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const [canManualRefresh, setCanManualRefresh] = useState(false)
  const [deletingRubric, setDeletingRubric] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  const fetchRubrics = useCallback(async () => {
    if (!session?.user?.accessToken) return

    setLoading(true)
    const apiClient = createApiClient(session.user.accessToken)
    try {
      const response = await apiClient.get("rubrics/")
      setRubrics(response.data.data)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch rubrics:", error)
      setError("Failed to load rubrics. Please try again later.")
    } finally {
      setLoading(false)
      setLastRefresh(Date.now())
    }
  }, [session])

  useEffect(() => {
    fetchRubrics()
    const intervalId = setInterval(fetchRubrics, 30000) // Poll every 30 seconds
    return () => clearInterval(intervalId)
  }, [fetchRubrics])

  useEffect(() => {
    const timerId = setInterval(() => {
      if (Date.now() - lastRefresh >= 5000) {
        setCanManualRefresh(true)
      }
    }, 1000)
    return () => clearInterval(timerId)
  }, [lastRefresh])

  const handleManualRefresh = () => {
    if (canManualRefresh) {
      fetchRubrics()
      setCanManualRefresh(false)
    }
  }

  const handleCreateRubric = () => {
    router.push("/dashboard/rubrics/create")
  }

  const handleDeleteRubric = async (id: string) => {
    if (!session?.user?.accessToken) return

    setDeletingRubric(id)
    const apiClient = createApiClient(session.user.accessToken)
    try {
      await apiClient.delete(`rubrics/${id}`)
      setRubrics(rubrics.filter(rubric => rubric.id !== id))
    } catch (error) {
      console.error("Failed to delete rubric:", error)
      setError("Failed to delete rubric. Please try again later.")
    } finally {
      setDeletingRubric(null)
    }
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
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleManualRefresh}
              disabled={!canManualRefresh || loading}
              title={canManualRefresh ? "Refresh rubrics" : "Wait 5 seconds before refreshing"}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleCreateRubric}>Create New Rubric</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && rubrics.length === 0 ? (
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
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/dashboard/rubrics/${rubric.id}`)}
                        >
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the rubric
                                "{rubric.title}" and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRubric(rubric.id)}
                                disabled={deletingRubric === rubric.id}
                              >
                                {deletingRubric === rubric.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {loading && rubrics.length > 0 && (
            <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}