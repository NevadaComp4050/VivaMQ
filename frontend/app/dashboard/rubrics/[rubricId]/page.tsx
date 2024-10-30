'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import { Input } from '~/components/ui/input'
import createApiClient from '~/lib/api-client'
import { useSession } from 'next-auth/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import {
  AlertCircle,
  Loader2,
  Download,
  FileQuestion,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

type Criterion = {
  name: string
  marks: number
  descriptors: Record<string, string>
}

type Rubric = {
  id: string
  title: string
  status: string
  rubricData: {
    criteria: Criterion[]
  } | null
}

export default function ViewRubricPage({
  params,
}: Readonly<{
  params: { rubricId: string }
}>) {
  const [rubric, setRubric] = useState<Rubric | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const fetchRubric = async () => {
    if (!session?.user?.accessToken) return

    const apiClient = createApiClient(session.user.accessToken)
    try {
      const response = await apiClient.get(`rubrics/${params.rubricId}`)
      setRubric(response.data.data)
      if (response.data.data.status === 'PENDING') {
        setTimeout(fetchRubric, 30000) // Poll every 30 seconds if status is PENDING
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to fetch rubric:', error)
      setError('Failed to load rubric. Please try again later.')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRubric()
  }, [params.rubricId, session])

  const handleExport = async (format: 'pdf' | 'xls') => {
    if (!session?.user?.accessToken) return

    const apiClient = createApiClient(session.user.accessToken)
    try {
      const response = await apiClient.get(
        `rubrics/${params.rubricId}/export/${format}`,
        {
          responseType: 'blob',
        }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `rubric-${params.rubricId}.${format}`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      console.error(`Failed to export ${format.toUpperCase()}:`, error)
      setError(`Failed to export ${format.toUpperCase()}. Please try again.`)
    }
  }

  const handleCriterionChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    if (!rubric || !rubric.rubricData) return

    const updatedCriteria = [...rubric.rubricData.criteria]
    if (field === 'name' || field === 'marks') {
      updatedCriteria[index] = { ...updatedCriteria[index], [field]: value }
    } else {
      updatedCriteria[index] = {
        ...updatedCriteria[index],
        descriptors: {
          ...updatedCriteria[index].descriptors,
          [field]: value as string,
        },
      }
    }
    setRubric({
      ...rubric,
      rubricData: { ...rubric.rubricData, criteria: updatedCriteria },
    })
  }

  const handleAddCriterion = () => {
    if (!rubric || !rubric.rubricData) return

    const newCriterion: Criterion = {
      name: 'New Criterion',
      marks: 0,
      descriptors: { F: '', P: '', C: '', D: '', HD: '' },
    }

    setRubric({
      ...rubric,
      rubricData: {
        ...rubric.rubricData,
        criteria: [...rubric.rubricData.criteria, newCriterion],
      },
    })
  }

  const handleRemoveCriterion = (index: number) => {
    if (!rubric || !rubric.rubricData) return

    const updatedCriteria = rubric.rubricData.criteria.filter(
      (_, i) => i !== index
    )
    setRubric({
      ...rubric,
      rubricData: { ...rubric.rubricData, criteria: updatedCriteria },
    })
  }

  const handleSave = async () => {
    if (!session?.user?.accessToken || !rubric || !rubric.rubricData) return

    setSaving(true)
    const apiClient = createApiClient(session.user.accessToken)
    try {
      const payload = {
        rubricData: {
          title: rubric.title,
          criteria: rubric.rubricData.criteria,
        },
        title: rubric.title,
      }
      await apiClient.put(`rubrics/${params.rubricId}`, payload)
      // Show success message or update UI as needed
    } catch (error) {
      console.error('Failed to save rubric:', error)
      setError('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-64"
        >
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
          <p className="text-lg font-semibold">Loading Rubric...</p>
          <p className="text-sm text-muted-foreground">
            Please wait while we fetch the rubric data.
          </p>
        </motion.div>
      )
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-64"
        >
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Rubric</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={router.refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </motion.div>
      )
    }

    if (!rubric) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-64"
        >
          <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">Rubric Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The requested rubric could not be found or may have been deleted.
          </p>
          <Button onClick={() => router.push('/dashboard/rubrics')}>
            View All Rubrics
          </Button>
        </motion.div>
      )
    }

    if (rubric.status === 'PENDING') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-64"
        >
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
          <h2 className="text-lg font-semibold mb-2">Generating Rubric...</h2>
          <p className="text-sm text-muted-foreground">
            This may take a few moments. We'll refresh automatically when it's
            ready.
          </p>
        </motion.div>
      )
    }

    if (!rubric.rubricData) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-64"
        >
          <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Rubric Data</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This rubric doesn't have any data yet. It may still be processing or
            there might have been an error during generation.
          </p>
          <Button onClick={fetchRubric}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Again
          </Button>
        </motion.div>
      )
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-8"
      >
        <AnimatePresence>
          {rubric.rubricData.criteria.map((criterion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`criterion-${index}`}
                        className="text-sm font-medium"
                      >
                        Criterion
                      </label>
                      <Textarea
                        id={`criterion-${index}`}
                        value={criterion.name}
                        onChange={(e) =>
                          handleCriterionChange(index, 'name', e.target.value)
                        }
                        className="mt-1 h-24"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <label
                          htmlFor={`marks-${index}`}
                          className="text-sm font-medium"
                        >
                          Marks
                        </label>
                        <Input
                          id={`marks-${index}`}
                          type="number"
                          value={criterion.marks}
                          onChange={(e) =>
                            handleCriterionChange(
                              index,
                              'marks',
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1 w-24"
                        />
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCriterion(index)}
                          disabled={rubric?.rubricData?.criteria.length === 1}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(criterion.descriptors).map(
                      ([grade, descriptor]) => (
                        <div key={grade}>
                          <label
                            htmlFor={`${grade}-${index}`}
                            className="text-sm font-medium"
                          >
                            {grade}
                          </label>
                          <Textarea
                            id={`${grade}-${index}`}
                            value={descriptor}
                            onChange={(e) =>
                              handleCriterionChange(index, grade, e.target.value)
                            }
                            className="mt-1 h-32"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleAddCriterion}>
              <Plus className="mr-2 h-4 w-4" />
              Add Criterion
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col p-8 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900  dark:to-gray-800 min-h-screen"
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/rubrics">Rubrics</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{rubric?.title || 'Loading...'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{rubric?.title ?? 'Loading Rubric...'}</CardTitle>
            <CardDescription className="mb-2 mt-2">
              {rubric?.status === 'PENDING'
                ? 'Generating rubric...'
                : 'View and edit rubric details'}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push('/dashboard/rubrics')}
                variant="outline"
              >
                Back
              </Button>
            </motion.div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button disabled={!rubric || rubric.status === 'PENDING'}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem disabled onSelect={() => handleExport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleExport('xls')}>
                  Export as XLS
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </motion.div>
  )
}