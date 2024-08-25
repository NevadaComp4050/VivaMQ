"use client";

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export default function UnitAssignmentsPage({ params }: { params: { unitId: string } }) {
  const [assignments, setAssignments] = useState([
    { id: 1, name: "Database Normalization", dueDate: "2023-06-15", submissions: 20 },
    { id: 2, name: "Query Optimization", dueDate: "2023-07-01", submissions: 15 },
    { id: 3, name: "Distributed Databases", dueDate: "2023-07-15", submissions: 18 },
  ])
  const [newAssignmentName, setNewAssignmentName] = useState("")

  const handleCreateAssignment = () => {
    if (newAssignmentName.trim()) {
      setAssignments([...assignments, { id: assignments.length + 1, name: newAssignmentName, dueDate: "TBD", submissions: 0 }])
      setNewAssignmentName("")
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Assignments for Unit {params.unitId}</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              placeholder="Assignment Name" 
              value={newAssignmentName}
              onChange={(e) => setNewAssignmentName(e.target.value)}
            />
            <Button onClick={handleCreateAssignment}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment Name</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.name}</TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>{assignment.submissions}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/units/${params.unitId}/assignments/${assignment.id}`}>Manage</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}