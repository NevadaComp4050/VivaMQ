'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { PlusIcon, FileIcon, DownloadIcon, Loader2 } from 'lucide-react'
import { toast } from "~/components/ui/use-toast"

interface Unit {
  id: string
  name: string
}

interface Assignment {
  id: string
  name: string
}

interface Criterion {
  id: number
  name: string
  marks: number
  descriptors: Record<string, string>
}

interface Rubric {
  id: string
  name: string
  unit: string
  assignment: string
  year: string
  session: string
  criteria: Criterion[]
}

export default function EditRubric({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [rubric, setRubric] = useState<Rubric | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const gradeDescriptors = ["F", "P", "C", "D", "HD"]

  useEffect(() => {
    const fetchRubric = async () => {
      try {
        const response = await fetch(`/api/rubrics/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setRubric(data)
        } else {
          throw new Error('Failed to fetch rubric')
        }
      } catch (error) {
        console.error('Error fetching rubric:', error)
        toast({
          title: "Error",
          description: "Failed to fetch rubric. Please try again.",
          variant: "destructive",
        })
      }
    }

    const fetchUnits = async () => {
      try {
        const response = await fetch('/api/units')
        if (response.ok) {
          const data = await response.json()
          setUnits(data)
        } else {
          throw new Error('Failed to fetch units')
        }
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    }

    fetchRubric()
    fetchUnits()
  }, [params.id])

  useEffect(() => {
    const fetchAssignments = async () => {
      if (rubric && rubric.unit) {
        try {
          const response = await fetch(`/api/units/${rubric.unit}/assignments`)
          if (response.ok) {
            const data = await response.json()
            setAssignments(data)
          } else {
            throw new Error('Failed to fetch assignments')
          }
        } catch (error) {
          console.error('Error fetching assignments:', error)
        }
      }
    }

    fetchAssignments()
  }, [rubric?.unit])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRubric((prev: any) => prev ? { ...prev, [name]: value } : null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setRubric((prev: any) => prev ? { ...prev, [name]: value } : null)
  }

  const handleCriterionChange = (id: number, field: 'name' | 'marks', value: string | number) => {
    setRubric((prev: { criteria: any[] }) => {
      if (!prev) return null
      return {
        ...prev,
        criteria: prev.criteria.map((c: { id: number }) => c.id === id ? { ...c, [field]: value } : c)
      }
    })
  }

  const handleDescriptorChange = (criterionId: number, grade: string, value: string) => {
    setRubric((prev: { criteria: any[] }) => {
      if (!prev) return null
      return {
        ...prev,
        criteria: prev.criteria.map((c: { id: number; descriptors: any }) => 
          c.id === criterionId 
            ? { ...c, descriptors: { ...c.descriptors, [grade]: value } } 
            : c
        )
      }
    })
  }

  const handleAddCriterion = () => {
    setRubric((prev: { criteria: string | any[] }) => {
      if (!prev) return null
      return {
        ...prev,
        criteria: [...prev.criteria, { id: prev.criteria.length + 1, name: '', marks: 0, descriptors: {} }]
      }
    })
  }

  const handleSave = async () => {
    if (!rubric) return
    try {
      const response = await fetch(`/api/rubrics/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rubric)
      })
      if (response.ok) {
        router.push('/rubrics')
      } else {
        throw new Error('Failed to update rubric')
      }
    } catch (error) {
      console.error('Error updating rubric:', error)
      toast({
        title: "Error",
        description: "Failed to update rubric. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateRubric = async () => {
    if (!rubric) return
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-rubric', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria: rubric.criteria.map((c: { name: any; marks: any }) => ({ name: c.name, marks: c.marks })) })
      })
      if (response.ok) {
        const generatedCriteria = await response.json()
        setRubric((prev: any) => prev ? { ...prev, criteria: generatedCriteria } : null)
      } else {
        throw new Error('Failed to generate rubric')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate rubric. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPDF = () => {
    // Logic to export rubric as PDF
    console.log('Exporting rubric as PDF...')
  }

  const handleExportXLS = () => {
    // Logic to export rubric as XLS
    console.log('Exporting rubric as XLS...')
  }

  if (!rubric) return <div>Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Rubric: {rubric.name}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rubric Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rubric Title</Label>
              <Input
                id="name"
                name="name"
                value={rubric.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={rubric.unit} onValueChange={(value: string) => handleSelectChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit: { id: any; name: any }) => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignment">Assignment</Label>
                <Select value={rubric.assignment} onValueChange={(value: string) => handleSelectChange('assignment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments.map((assignment: { id: any; name: any }) => (
                      <SelectItem key={assignment.id} value={assignment.id}>{assignment.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select value={rubric.year} onValueChange={(value: string) => handleSelectChange('year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session">Session</Label>
                <Select value={rubric.session} onValueChange={(value: string) => handleSelectChange('session', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S1">S1</SelectItem>
                    <SelectItem value="S2">S2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Criteria</Label>
              {rubric.criteria.map((criterion: { id: number; name: any; marks: any }) => (
                <div key={criterion.id} className="flex space-x-2">
                  <Input
                    placeholder="Criterion name"
                    value={criterion.name}
                    onChange={(e: { target: { value: string | number } }) => handleCriterionChange(criterion.id, 'name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Marks"
                    value={criterion.marks}
                    onChange={(e: { target: { value: string } }) => handleCriterionChange(criterion.id, 'marks', parseInt(e.target.value))}
                  />
                </div>
              ))}
              <Button type="button" onClick={handleAddCriterion}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Criterion
              </Button>
            </div>

            <Button type="button" onClick={handleGenerateRubric} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Rubric'
              )}
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Generated Rubric</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Criterion</TableHead>
                      {gradeDescriptors.map((grade) => (
                        <TableHead key={grade}>{grade}</TableHead>
                      ))}
                      <TableHead>Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rubric.criteria.map((criterion: { id: number; name: any; descriptors: { [x: string]: any }; marks: any }) => (
                      <TableRow key={criterion.id}>
                        <TableCell>{criterion.name}</TableCell>
                        {gradeDescriptors.map((grade) => (
                          <TableCell key={grade}>
                            <Textarea
                              value={criterion.descriptors[grade] || ''}
                              onChange={(e: { target: { value: string } }) => handleDescriptorChange(criterion.id, grade, e.target.value)}
                              placeholder={`${grade} descriptor`}
                            />
                          </TableCell>
                        ))}
                        <TableCell>{criterion.marks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button onClick={handleSave}>Save Changes</Button>
              <div className="space-x-2">
                <Button onClick={handleExportPDF}>
                  <FileIcon className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
                <Button onClick={handleExportXLS}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export as XLS
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}