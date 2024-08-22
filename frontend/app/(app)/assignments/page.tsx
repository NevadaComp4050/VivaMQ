"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      unit: "Advanced Database Systems",
      name: "Database Normalization",
      vivaStatus: "Pending",
    },
    {
      id: 2,
      unit: "Software Engineering Principles",
      name: "Design Patterns",
      vivaStatus: "In Progress",
    },
    {
      id: 3,
      unit: "Machine Learning Fundamentals",
      name: "Neural Networks",
      vivaStatus: "Completed",
    },
  ]);
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const handleCreateAssignment = () => {
    if (newAssignmentName.trim() && selectedUnit) {
      setAssignments([
        ...assignments,
        {
          id: assignments.length + 1,
          unit: selectedUnit,
          name: newAssignmentName,
          vivaStatus: "Pending",
        },
      ]);
      setNewAssignmentName("");
      setSelectedUnit("");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Assignment Management</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Advanced Database Systems">
                  Advanced Database Systems
                </SelectItem>
                <SelectItem value="Software Engineering Principles">
                  Software Engineering Principles
                </SelectItem>
                <SelectItem value="Machine Learning Fundamentals">
                  Machine Learning Fundamentals
                </SelectItem>
              </SelectContent>
            </Select>
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
                <TableHead>Unit</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Viva Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.unit}</TableCell>
                  <TableCell>{assignment.name}</TableCell>
                  <TableCell>{assignment.vivaStatus}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Manage Viva
                      </Button>
                      <Button variant="destructive" size="sm">
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
