"use client";

import { useState, useEffect } from "react";
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
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function UnitAssignmentsPage({
  params,
}: {
  params: { unitId: string };
}) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`/api/units/${params.unitId}/assignments`);
        if (!response.ok) {
          throw new Error("Failed to fetch assignments");
        }
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        setError("Error fetching assignments data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [params.unitId]);

  const handleCreateAssignment = async () => {
    if (newAssignmentName.trim()) {
      try {
        const response = await fetch(
          `/api/units/${params.unitId}/assignments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newAssignmentName }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create assignment");
        }

        const newAssignment = await response.json();
        setAssignments([...assignments, newAssignment]);
        setNewAssignmentName("");
      } catch (err) {
        console.error("Error creating assignment:", err);
        setError("Failed to create assignment");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Assignments for Unit {params.unitId}
      </h1>

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
                      <Link
                        href={`/units/${params.unitId}/assignments/${assignment.id}`}
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
