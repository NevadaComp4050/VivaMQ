"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  FileTextIcon,
  UsersIcon,
  ClipboardCheckIcon,
  FileEditIcon,
} from "lucide-react";
import Link from "next/link";

export default function AssignmentPage({
  params,
}: {
  params: { unitId: string; assignmentId: string };
}) {
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(
          `/api/units/${params.unitId}/assignments/${params.assignmentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch assignment");
        }
        const data = await response.json();
        setAssignment(data);
      } catch (err) {
        setError("Error fetching assignment data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [params.unitId, params.assignmentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!assignment) return <div>No assignment found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Assignment: {assignment.name}</h1>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <FileTextIcon className="w-4 h-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <UsersIcon className="w-4 h-4 mr-2" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="vivas">
            <ClipboardCheckIcon className="w-4 h-4 mr-2" />
            Vivas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{assignment.description}</p>
              <div className="mb-4">
                <strong>Due Date:</strong> {assignment.dueDate}
              </div>
              <Button asChild>
                <Link
                  href={`/units/${params.unitId}/assignments/${params.assignmentId}/rubrics`}
                >
                  <FileEditIcon className="w-4 h-4 mr-2" />
                  Manage Rubric
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignment.submissions.map((submission: any) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.studentName}</TableCell>
                      <TableCell>{submission.submissionDate}</TableCell>
                      <TableCell>{submission.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/units/${params.unitId}/assignments/${params.assignmentId}/submissions/${submission.id}`}
                          >
                            Review
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vivas">
          <Card>
            <CardHeader>
              <CardTitle>Vivas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Viva Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignment.submissions.map((submission: any) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.studentName}</TableCell>
                      <TableCell>{submission.vivaStatus}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/units/${params.unitId}/assignments/${params.assignmentId}/vivas/${submission.id}`}
                          >
                            Manage Viva
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
