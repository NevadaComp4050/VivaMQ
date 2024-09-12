"use client";
import {
  useState,
  useEffect,
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import { LockIcon, RefreshCwIcon, CheckIcon, XIcon } from "lucide-react";

export default function SingleSubmissionReviewPage({
  params,
}: {
  params: {
    unitId: string;
    assignmentId: string;
    vivaId: string;
    submissionId: string;
  };
}) {
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update in the SingleSubmissionReviewPage component

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

  const handleLockQuestion = async (questionId: number) => {
    try {
      const response = await fetch(
        `/api/vivas/${params.vivaId}/questions/${questionId}/toggle-lock`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle question lock");
      }
      const updatedQuestion = await response.json();
      setSubmission((prev: { questions: any[] }) => ({
        ...prev,
        questions: prev.questions.map((q: any) =>
          q.id === questionId ? updatedQuestion : q
        ),
      }));
    } catch (err) {
      console.error("Error toggling question lock:", err);
    }
  };

  const handleRegenerateQuestion = async (questionId: number) => {
    try {
      const response = await fetch(
        `/api/vivas/${params.vivaId}/questions/${questionId}/regenerate`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to regenerate question");
      }
      const updatedQuestion = await response.json();
      setSubmission((prev: { questions: any[] }) => ({
        ...prev,
        questions: prev.questions.map((q: any) =>
          q.id === questionId ? updatedQuestion : q
        ),
      }));
    } catch (err) {
      console.error("Error regenerating question:", err);
    }
  };

  const handleApproveQuestions = async () => {
    try {
      const response = await fetch(
        `/api/vivas/${params.vivaId}/approve-questions`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve questions");
      }
      // Handle success (e.g., show a success message or update UI)
    } catch (err) {
      console.error("Error approving questions:", err);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const response = await fetch(
        `/api/vivas/${params.vivaId}/mark-complete`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark viva as complete");
      }
      // Handle success (e.g., show a success message or redirect)
    } catch (err) {
      console.error("Error marking viva as complete:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!submission) return <div>No submission found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Review Submission: {submission.studentName}
      </h1>

      <div className="grid grid-cols-2 gap-6">
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
                <Label>Assignment</Label>
                <div>{submission.assignmentName}</div>
              </div>
              <div>
                <Label>Submission Date</Label>
                <div>{submission.submissionDate}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <p>{submission.content}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Viva Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submission.questions.map(
                (question: {
                  id: Key | null | undefined;
                  text:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<AwaitedReactNode>
                    | null
                    | undefined;
                  status:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | Promise<AwaitedReactNode>
                    | null
                    | undefined;
                }) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.text}</TableCell>
                    <TableCell>{question.status}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={
                            question.status === "Locked" ? "default" : "outline"
                          }
                          onClick={() => handleLockQuestion(question.id)}
                        >
                          <LockIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRegenerateQuestion(question.id)}
                          disabled={question.status === "Locked"}
                        >
                          <RefreshCwIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={handleApproveQuestions}>
          Approve Questions
        </Button>
        <Button onClick={handleMarkComplete}>
          <CheckIcon className="mr-2 h-4 w-4" />
          Mark Complete
        </Button>
      </div>
    </div>
  );
}
