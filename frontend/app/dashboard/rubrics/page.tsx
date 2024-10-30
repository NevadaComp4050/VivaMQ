'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { useRouter } from 'next/navigation'
import createApiClient from '~/lib/api-client'
import { useSession } from 'next-auth/react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb'
import { AlertCircle, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
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
} from '~/components/ui/alert-dialog'

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
      const response = await apiClient.get('rubrics/')
      setRubrics(response.data.data)
      setError(null)
    } catch (error) {
      console.error('Failed to fetch rubrics:', error)
      setError('Failed to load rubrics. Please try again later.')
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
    router.push('/dashboard/rubrics/create')
  }

  const handleDeleteRubric = async (id: string) => {
    if (!session?.user?.accessToken) return

    setDeletingRubric(id)
    const apiClient = createApiClient(session.user.accessToken)
    try {
      await apiClient.delete(`rubrics/${id}`)
      setRubrics(rubrics.filter(rubric => rubric.id !== id))
    } catch (error) {
      console.error('Failed to delete rubric:', error)
      setError('Failed to delete rubric. Please try again later.')
    } finally {
      setDeletingRubric(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col w-full p-8 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
    >
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                onClick={handleManualRefresh}
                disabled={!canManualRefresh || loading}
                title={canManualRefresh ? 'Refresh rubrics' : 'Wait 5 seconds before refreshing'}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleCreateRubric}>Create New Rubric</Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {loading && rubrics.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-32"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            ) : (
              <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                    <AnimatePresence>
                      {rubrics.map((rubric) => (
                        <motion.tr
                          key={rubric.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell className="font-medium">{rubric.title}</TableCell>
                          <TableCell>{rubric.status}</TableCell>
                          <TableCell>{new Date(rubric.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="outline"
                                  onClick={() => router.push(`/dashboard/rubrics/${rubric.id}`)}
                                >
                                  View
                                </Button>
                              </motion.div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="destructive" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
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
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </AnimatePresence>
          {loading && rubrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 flex items-center justify-center text-sm text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Updating...
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}