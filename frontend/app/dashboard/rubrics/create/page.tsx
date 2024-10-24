"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import createApiClient from "~/lib/api-client"
import { useSession } from "next-auth/react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb"
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form"

type FormData = {
  title: string
  assessmentTask: string
  criteria: { value: string }[]
  keywords: { value: string }[]
  learningObjectives: { value: string }[]
  existingGuide: string
}

export default function CreateRubricPage() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      criteria: [{ value: '' }],
      keywords: [{ value: '' }],
      learningObjectives: [{ value: '' }],
    }
  })
  const { fields: criteriaFields, append: appendCriteria, remove: removeCriteria } = useFieldArray({ control, name: "criteria" })
  const { fields: keywordsFields, append: appendKeywords, remove: removeKeywords } = useFieldArray({ control, name: "keywords" })
  const { fields: learningObjectivesFields, append: appendLearningObjectives, remove: removeLearningObjectives } = useFieldArray({ control, name: "learningObjectives" })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!session?.user?.accessToken) return
    setLoading(true)
    setError(null)

    const apiClient = createApiClient(session.user.accessToken)
    try {
      const response = await apiClient.post("rubrics/", {
        ...data,
        criteria: data.criteria.map(c => c.value),
        keywords: data.keywords.map(k => k.value),
        learningObjectives: data.learningObjectives.map(lo => lo.value),
      })
      router.push(`/dashboard/rubrics/${response.data.data.id}`)
    } catch (error) {
      console.error("Failed to create rubric:", error)
      setError("Failed to create rubric. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderDynamicTable = (
    fields: { id: string; value: string }[],
    append: () => void,
    remove: (index: number) => void,
    name: "criteria" | "keywords" | "learningObjectives"
  ) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{name.charAt(0).toUpperCase() + name.slice(1)}</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field, index) => (
          <TableRow key={field.id}>
            <TableCell>
              <Input
                {...register(`${name}.${index}.value` as const, { required: `${name} is required` })}
                placeholder={`Enter ${name}`}
              />
              {errors[name]?.[index]?.value && (
                <p className="text-red-500 text-sm mt-1">{errors[name]?.[index]?.value?.message}</p>
              )}
            </TableCell>
            <TableCell>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
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
    <div className="container mx-auto p-4 space-y-4">
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="assessmentTask">Assessment Task Overview</Label>
              <Textarea
                id="assessmentTask"
                {...register("assessmentTask", { required: "Assessment task is required" })}
              />
              {errors.assessmentTask && <p className="text-red-500 text-sm mt-1">{errors.assessmentTask.message}</p>}
            </div>
            <div>
              <Label>Criteria</Label>
              {renderDynamicTable(criteriaFields, () => appendCriteria({ value: '' }), removeCriteria, "criteria")}
            </div>
            <div>
              <Label>Keywords</Label>
              {renderDynamicTable(keywordsFields, () => appendKeywords({ value: '' }), removeKeywords, "keywords")}
            </div>
            <div>
              <Label>Learning Objectives</Label>
              {renderDynamicTable(learningObjectivesFields, () => appendLearningObjectives({ value: '' }), removeLearningObjectives, "learningObjectives")}
            </div>
            <div>
              <Label htmlFor="existingGuide">Existing Guide (optional)</Label>
              <Textarea
                id="existingGuide"
                {...register("existingGuide")}
              />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>Back</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : 'Create Rubric'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}