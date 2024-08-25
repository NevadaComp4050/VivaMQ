"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
import { SearchIcon } from "lucide-react";
import Link from "next/link";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      name: "Database Normalization",
      unit: "Advanced Database Systems",
      unitId: 1,
      dueDate: "2023-06-15",
      submissions: 20,
    },
    {
      id: 2,
      name: "Software Design Patterns",
      unit: "Software Engineering Principles",
      unitId: 2,
      dueDate: "2023-07-01",
      submissions: 25,
    },
    {
      id: 3,
      name: "Machine Learning Algorithms",
      unit: "Machine Learning Fundamentals",
      unitId: 3,
      dueDate: "2023-07-15",
      submissions: 18,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  const filteredAssignments = assignments.filter(
    (assignment) =>
      (assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.unit.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedUnit === "" || assignment.unit === selectedUnit)
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Assignments</h1>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedUnit}
              onValueChange={(value) => {
                setSelectedUnit(value === "All" ? "" : value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Units</SelectItem>
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
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.name}</TableCell>
                  <TableCell>{assignment.unit}</TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>{assignment.submissions}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`units/${assignment.unitId}/assignments/${assignment.id}`}
                      >
                        Manage
                      </Link>
                    </Button>
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
