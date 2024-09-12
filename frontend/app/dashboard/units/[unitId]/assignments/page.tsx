"use client";

import { useState, useEffect, SetStateAction } from "react";
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
import { PlusIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "~/components/ui/use-toast";

interface Assignment {
  id: string;
  name: string;
  dueDate: string;
  submissions: number;
}

export default function Component({ params }: { params: { unitId: string } }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [params.unitId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/units/${params.unitId}/assignments`);
      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch assignments. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (newAssignmentName.trim() && newAssignmentDueDate) {
      try {
        setCreating(true);
        const response = await fetch(
          `/api/units/${params.unitId}/assignments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newAssignmentName,
              dueDate: newAssignmentDueDate,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create assignment");
        }

        const newAssignment = await response.json();
        setAssignments([...assignments, newAssignment]);
        setNewAssignmentName("");
        setNewAssignmentDueDate("");
        toast({
          title: "Success",
          description: "Assignment created successfully.",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to create assignment. Please try again.",
          variant: "destructive",
        });
        console.error(err);
      } finally {
        setCreating(false);
      }
    }
  };

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
              onChange={(e: any) => setNewAssignmentName(e.target.value)}
            />
            <Input
              type="date"
              value={newAssignmentDueDate}
              onChange={(e: any) => setNewAssignmentDueDate(e.target.value)}
            />
            <Button onClick={handleCreateAssignment} disabled={creating}>
              {creating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusIcon className="mr-2 h-4 w-4" />
              )}
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
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : assignments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No assignments found for this unit.
            </p>
          ) : (
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
                    <TableCell>
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{assignment.submissions}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/dashboard/units/${params.unitId}/assignments/${assignment.id}`}
                        >
                          Manage
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
