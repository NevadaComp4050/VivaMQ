"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  category: string;
}

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submissionDate: string;
  status: string;
  content?: string;
  pdfSubmission?: {
    fileName: string;
    extractedText?: string;
  };
  questions: Question[];
}

export default function SingleSubmissionReviewPage({
  params,
}: {
  params: { unitId: string; assignmentId: string; submissionId: string };
}) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(
          `/api/units/${params.unitId}/assignments/${params.assignmentId}/submissions/${params.submissionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch submission");
        }
        const data = await response.json();
        setSubmission(data);
      } catch (err) {
        setError("Error fetching submission data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [params.unitId, params.assignmentId, params.submissionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!submission)
    return <div className="p-8 text-center">No submission found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Review Submission: {submission.studentName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <Label>Student Name</Label>
                <div>{submission.studentName}</div>
              </div>
              <div>
                <Label>Student ID</Label>
                <div>{submission.studentId}</div>
              </div>
              <div>
                <Label>Submission Date</Label>
                <div>
                  {new Date(submission.submissionDate).toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <div>{submission.status}</div>
              </div>
              {submission.pdfSubmission && (
                <div>
                  <Label>PDF File</Label>
                  <div>{submission.pdfSubmission.fileName}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <p>
                {submission.pdfSubmission?.extractedText ||
                  submission.content ||
                  "No content available"}
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Generated Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submission.questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.text}</TableCell>
                  <TableCell>{question.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button asChild>
          <a
            href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}`}
          >
            Back to Assignment
          </a>
        </Button>
      </div>
    </div>
  );
}
