"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ScrollArea } from "~/components/ui/scroll-area"
import { UploadIcon, LockIcon, RefreshCwIcon, FileDownIcon } from 'lucide-react'

export default function VivaManagement() {
  const [units, setUnits] = useState([
    { id: "unit1", name: "Advanced Database Systems" },
    { id: "unit2", name: "Software Engineering Principles" },
  ])
  const [assignments, setAssignments] = useState([
    { id: "assignment1", name: "Database Normalization", unitId: "unit1" },
    { id: "assignment2", name: "SQL Queries", unitId: "unit1" },
    { id: "assignment3", name: "Design Patterns", unitId: "unit2" },
    { id: "assignment4", name: "Agile Methodologies", unitId: "unit2" },
  ])
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", assignmentId: "assignment1", submissionText: "This is John's submission about database normalization...", questions: [
      { id: 1, text: "Explain the concept of 3NF in database design.", status: "Locked" },
      { id: 2, text: "Describe the differences between 1NF, 2NF, and 3NF.", status: "Unlocked" },
    ]},
    { id: 2, name: "Jane Smith", assignmentId: "assignment1", submissionText: "Jane's submission on database normalization...", questions: [
      { id: 1, text: "What are the advantages of using the BCNF?", status: "Locked" },
      { id: 2, text: "Explain the concept of functional dependencies.", status: "Unlocked" },
    ]},
    { id: 3, name: "Alice Johnson", assignmentId: "assignment2", submissionText: "Alice's submission on SQL queries...", questions: [
      { id: 1, text: "Explain the difference between INNER JOIN and LEFT JOIN.", status: "Unlocked" },
      { id: 2, text: "What is the purpose of the GROUP BY clause?", status: "Unlocked" },
    ]},
    { id: 4, name: "Bob Williams", assignmentId: "assignment3", submissionText: "Bob's submission on design patterns...", questions: [
      { id: 1, text: "Describe the Singleton design pattern and its use cases.", status: "Locked" },
      { id: 2, text: "Compare and contrast the Factory and Abstract Factory patterns.", status: "Unlocked" },
    ]},
  ])

  const [selectedUnit, setSelectedUnit] = useState("")
  const [selectedAssignment, setSelectedAssignment] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)

  const [filteredAssignments, setFilteredAssignments] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])

  useEffect(() => {
    if (selectedUnit) {
      const filtered = assignments.filter(assignment => assignment.unitId === selectedUnit)
      setFilteredAssignments(filtered)
      setSelectedAssignment("")
      setSelectedStudent(null)
    } else {
      setFilteredAssignments([])
    }
  }, [selectedUnit])

  useEffect(() => {
    if (selectedAssignment) {
      const filtered = students.filter(student => student.assignmentId === selectedAssignment)
      setFilteredStudents(filtered)
      setSelectedStudent(null)
    } else {
      setFilteredStudents([])
    }
  }, [selectedAssignment])

  const handleUpload = () => {
    // Handle file upload logic
    console.log("Uploading files...")
  }

  const handleGenerateQuestions = () => {
    // Handle question generation logic
    console.log("Generating questions...")
  }

  const handleLockQuestion = (studentId, questionId) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? {...student, questions: student.questions.map(q => 
            q.id === questionId ? {...q, status: q.status === "Locked" ? "Unlocked" : "Locked"} : q
          )}
        : student
    ))
  }

  const handleRegenerateQuestion = (studentId, questionId) => {
    // Handle question regeneration logic
    console.log("Regenerating question:", questionId, "for student:", studentId)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Viva Management</h1>
      
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Submissions</TabsTrigger>
          <TabsTrigger value="generate">Generate Questions</TabsTrigger>
          <TabsTrigger value="review">Review Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedAssignment} onValueChange={setSelectedAssignment} disabled={!selectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAssignments.map(assignment => (
                      <SelectItem key={assignment.id} value={assignment.id}>{assignment.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div>
                  <Label htmlFor="submission-upload">Upload Submissions (ZIP)</Label>
                  <Input id="submission-upload" type="file" accept=".zip" />
                </div>
                <div>
                  <Label htmlFor="mapping-upload">Upload Mapping File (CSV)</Label>
                  <Input id="mapping-upload" type="file" accept=".csv" />
                </div>
                <Button onClick={handleUpload}>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload and Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedAssignment} onValueChange={setSelectedAssignment} disabled={!selectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAssignments.map(assignment => (
                      <SelectItem key={assignment.id} value={assignment.id}>{assignment.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleGenerateQuestions}>Generate Questions</Button>
                <p className="text-sm text-muted-foreground">Note: Question generation can take up to 24 hours.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>Review Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedAssignment} onValueChange={setSelectedAssignment} disabled={!selectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAssignments.map(assignment => (
                      <SelectItem key={assignment.id} value={assignment.id}>{assignment.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {filteredStudents.map((student) => (
                            <Button 
                              key={student.id} 
                              variant={selectedStudent?.id === student.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => setSelectedStudent(student)}
                            >
                              {student.name}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  {selectedStudent && (
                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle>{selectedStudent.name}'s Submission</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px] mb-4">
                          <p className="text-sm">{selectedStudent.submissionText}</p>
                        </ScrollArea>
                        <div className="space-y-4">
                          <h4 className="font-semibold">Questions</h4>
                          {selectedStudent.questions.map((question) => (
                            <div key={question.id} className="flex items-center justify-between space-x-2 p-2 border rounded">
                              <p className="text-sm flex-grow">{question.text}</p>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant={question.status === "Locked" ? "default" : "outline"}
                                  onClick={() => handleLockQuestion(selectedStudent.id, question.id)}
                                >
                                  <LockIcon className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleRegenerateQuestion(selectedStudent.id, question.id)}
                                  disabled={question.status === "Locked"}
                                >
                                  <RefreshCwIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline">
                            <FileDownIcon className="mr-2 h-4 w-4" />
                            Export Questions
                          </Button>
                          <Button>Save Changes</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}