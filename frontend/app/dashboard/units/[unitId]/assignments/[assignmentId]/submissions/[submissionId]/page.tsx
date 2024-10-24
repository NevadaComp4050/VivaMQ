"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { Loader2, Maximize2 } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";
import createApiClient from "~/lib/api-client";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface VivaQuestion {
  id: string;
  submissionId: string;
  question: string;
  status: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string | null;
  submissionFile: string;
  status: string;
  summary: string | null;
  qualityAssessment: string | null;
  studentCode: string | null;
  vivaStatus: string;
  vivaQuestions: VivaQuestion[];
}

export default function SingleSubmissionReviewPage({
  params,
}: Readonly<{
  params: { unitId: string; assignmentId: string; submissionId: string };
}>) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFileContent, setCurrentFileContent] = useState<string | null>(
    null
  );
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();
  const fileContentRef = useRef<string | null>(null);

  const fetchFileContent = useCallback(
    async (fileId: string) => {
      if (!session?.user?.accessToken) return;

      const apiClient = createApiClient(session.user.accessToken);
      try {
        const response = await apiClient.get(`submissions/${fileId}/file`, {
          responseType: "blob",
        });
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        fileContentRef.current = url;
        setCurrentFileContent(url);
      } catch (error) {
        console.error("Error fetching file content:", error);
        toast({
          title: "Error",
          description: "Failed to fetch file content. Please try again.",
          variant: "destructive",
        });
      }
    },
    [session, toast]
  );

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        if (!session?.user?.accessToken) return;
        const apiClient = createApiClient(session.user.accessToken);
        const response = await apiClient.get(
          `/submissions/${params.submissionId}`
        );
        setSubmission(response.data.data);
        if (response.data.data.submissionFile) {
          fetchFileContent(response.data.data.id);
        }
      } catch (err) {
        setError("Error fetching submission data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [params.submissionId, session, fetchFileContent]);

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
        Review Submission: {submission.id}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <Label>Submission ID</Label>
                <div>{submission.id}</div>
              </div>
              <div>
                <Label>Assignment ID</Label>
                <div>{submission.assignmentId}</div>
              </div>
              <div>
                <Label>Student ID</Label>
                <div>{submission.studentId || "N/A"}</div>
              </div>
              <div>
                <Label>Status</Label>
                <div>{submission.status}</div>
              </div>
              <div>
                <Label>Viva Status</Label>
                <div>{submission.vivaStatus}</div>
              </div>
              <div>
                <Label>Submission File</Label>
                <div>{submission.submissionFile}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Submission Content
              <Dialog
                open={isFullscreenOpen}
                onOpenChange={setIsFullscreenOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-full w-[90vw] h-[90vh]">
                  {currentFileContent && (
                    <div className="flex flex-col gap-6">
                      <DialogHeader>
                        <DialogTitle>Submission Content</DialogTitle>
                      </DialogHeader>
                      <div className="w-full h-full">
                        <embed
                          src={currentFileContent}
                          type="application/pdf"
                          width="100%"
                          height="100%"
                          className="rounded-md w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full rounded-md border p-4">
              {currentFileContent && (
                <embed
                  src={currentFileContent}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  onError={() => {
                    toast({
                      title: "Error",
                      description: "Failed to load PDF.",
                      variant: "destructive",
                    });
                  }}
                />
              )}
            </div>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {submission.vivaQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>{question.question}</TableCell>
                  <TableCell>{question.status}</TableCell>
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
