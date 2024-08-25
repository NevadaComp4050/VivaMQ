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
import Link from "next/link";

export default function AssignmentPage({
  params,
}: {
  params: { unitId: string; assignmentId: string };
}) {
  // In a real application, you would fetch the assignment details based on the unitId and assignmentId
  const assignment = {
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
      },
      {
        id: 2,
        studentName: "Jane Smith",
        submissionDate: "2023-06-12",
        status: "Submitted",
      },
      {
        id: 3,
        studentName: "Alice Johnson",
        submissionDate: "-",
        status: "Not Submitted",
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Assignment: {assignment.name}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{assignment.description}</p>
          <div>
            <strong>Due Date:</strong> {assignment.dueDate}
          </div>
        </CardContent>
      </Card>

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
                      <Link href={`/vivas/${submission.id}`}>Review</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button asChild>
          <Link
            href={`/units/${params.unitId}/assignments/${params.assignmentId}/vivas`}
          >
            Manage Vivas
          </Link>
        </Button>
      </div>
    </div>
  );
}
