'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
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
import { AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'

type CreateFormData = {
  title: string
  assessmentTask: string
  criteria: { value: string }[]
  keywords: { value: string }[]
  learningObjectives: { value: string }[]
}

type ConvertFormData = {
  title: string
  existingGuide: string
}

export default function CreateRubricPage() {
  const [activeTab, setActiveTab] = useState('create')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  const {
    register: registerCreate,
    control: controlCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<CreateFormData>({
    defaultValues: {
      criteria: [{ value: '' }],
      keywords: [{ value: '' }],
      learningObjectives: [{ value: '' }],
    },
  })

  const {
    register: registerConvert,
    handleSubmit: handleSubmitConvert,
    formState: { errors: errorsConvert },
    reset: resetConvert,
  } = useForm<ConvertFormData>()

  const {
    fields: criteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({ control: controlCreate, name: 'criteria' })
  const {
    fields: keywordsFields,
    append: appendKeywords,
    remove: removeKeywords,
  } = useFieldArray({ control: controlCreate, name: 'keywords' })
  const {
    fields: learningObjectivesFields,
    append: appendLearningObjectives,
    remove: removeLearningObjectives,
  } = useFieldArray({ control: controlCreate, name: 'learningObjectives' })

  const onSubmitCreate: SubmitHandler<CreateFormData> = async (data) => {
    if (!session?.user?.accessToken) return
    setLoading(true)
    setError(null)

    const apiClient = createApiClient(session.user.accessToken)
    try {
      const payload = {
        ...data,
        criteria: data.criteria.map((c) => c.value),
        keywords: data.keywords.map((k) => k.value),
        learningObjectives: data.learningObjectives.map((lo) => lo.value),
        existingGuide: 'null',
      }

      const response = await apiClient.post('rubrics/', payload)
      router.push(`/dashboard/rubrics/${response.data.data.id}`)
    } catch (error) {
      console.error('Failed to create rubric:', error)
      setError('Failed to create rubric. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const onSubmitConvert: SubmitHandler<ConvertFormData> = async (data) => {
    if (!session?.user?.accessToken) return
    setLoading(true)
    setError(null)

    const apiClient = createApiClient(session.user.accessToken)
    try {
      let payload = {
        ...data,
        assessmentTask: 'extract from guide',
        criteria: ['extract from guide'],
        keywords: ['extract from guide'],
        learningObjectives: ['extract from guide'],
      }

      const response = await apiClient.post('rubrics/', payload)
      router.push(`/dashboard/rubrics/${response.data.data.id}`)
    } catch (error) {
      console.error('Failed to convert marking guide:', error)
      setError('Failed to convert marking guide. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderDynamicTable = (
    fields: { id: string; value: string }[],
    append: () => void,
    remove: (index: number) => void,
    name: 'criteria' | 'keywords' | 'learningObjectives'
  ) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{name.charAt(0).toUpperCase() + name.slice(1)}</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.tr
              key={field.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TableCell>
                <Input
                  {...registerCreate(`${name}.${index}.value` as const, {
                    required: `${name} is required`,
                  })}
                  placeholder={`Enter ${name}`}
                />
                {errorsCreate[name]?.[index]?.value && (
                  <p className="text-red-500 text-sm mt-1">
                    {errorsCreate[name]?.[index]?.value?.message}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </TableBody>
      <TableRow>
        <TableCell colSpan={2}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append()}
            >
              <Plus className="h-4 w-4 mr-2" /> Add {name}
            </Button>
        </TableCell>
      </TableRow>
    </Table>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
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
            <BreadcrumbPage>Create New Rubric</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Create New Rubric</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <Tabs
            defaultValue="create"
            onValueChange={(value) => {
              setActiveTab(value)
              resetCreate()
              resetConvert()
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create New Rubric</TabsTrigger>
              <TabsTrigger value="convert">Convert Marking Guide</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <motion.form
                onSubmit={handleSubmitCreate(onSubmitCreate)}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    {...registerCreate('title', {
                      required: 'Title is required',
                    })}
                  />
                  {errorsCreate.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsCreate.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="assessmentTask">
                    Assessment Task Overview
                  </Label>
                  <Textarea
                    id="assessmentTask"
                    {...registerCreate('assessmentTask', {
                      required: 'Assessment task is required',
                    })}
                  />
                  {errorsCreate.assessmentTask && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsCreate.assessmentTask.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Criteria</Label>
                  {renderDynamicTable(
                    criteriaFields,
                    () => appendCriteria({ value: '' }),
                    removeCriteria,
                    'criteria'
                  )}
                </div>
                <div>
                  <Label>Keywords</Label>
                  {renderDynamicTable(
                    keywordsFields,
                    () => appendKeywords({ value: '' }),
                    removeKeywords,
                    'keywords'
                  )}
                </div>
                <div>
                  <Label>Learning Objectives</Label>
                  {renderDynamicTable(
                    learningObjectivesFields,
                    () => appendLearningObjectives({ value: '' }),
                    removeLearningObjectives,
                    'learningObjectives'
                  )}
                </div>
                <div className="flex justify-between">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                          Creating...
                        </>
                      ) : (
                        'Create Rubric'
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            </TabsContent>
            <TabsContent value="convert">
              <motion.form
                onSubmit={handleSubmitConvert(onSubmitConvert)}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <Label htmlFor="convert-title">Title</Label>
                  <Input
                    id="convert-title"
                    {...registerConvert('title', {
                      required: 'Title is required',
                    })}
                  />
                  {errorsConvert.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsConvert.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="existingGuide">Existing Marking Guide</Label>
                  <Textarea
                    id="existingGuide"
                    {...registerConvert('existingGuide', {
                      required: 'Existing guide is required',
                    })}
                    rows={10}
                    placeholder="Paste your existing marking guide here..."
                  />
                  {errorsConvert.existingGuide && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorsConvert.existingGuide.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-between">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}   whileTap={{ scale: 0.95 }}>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                          Converting...
                        </>
                      ) : (
                        'Convert to Rubric'
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}