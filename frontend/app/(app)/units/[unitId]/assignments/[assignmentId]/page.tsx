"use client";
import { useState } from "react";
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
  const [assignment, setAssignment] = useState({
    id: params.assignmentId,
    name: "Database Normalization",
    description: "Analyze and normalize the given database schema.",
    dueDate: "2023-06-15",
    submissions: [
      {
        id: 1,
        studentName: "John Doe",
        submissionDate: "2023-06-10",
        status: "Submitted",
        vivaStatus: "Pending",
      },
      {
        id: 2,
        studentName: "Jane Smith",
        submissionDate: "2023-06-12",
        status: "Submitted",
        vivaStatus: "Completed",
      },
      {
        id: 3,
        studentName: "Alice Johnson",
        submissionDate: "-",
        status: "Not Submitted",
        vivaStatus: "Not Available",
      },
    ],
  });

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
                  {assignment.submissions.map((submission) => (
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
                  {assignment.submissions.map((submission) => (
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
