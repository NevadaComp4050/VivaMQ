"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Loader2,
  Maximize2,
  Lock,
  Unlock,
  Plus,
  Edit,
  RotateCw,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "~/components/ui/use-toast";
import createApiClient from "~/lib/api-client";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import { motion } from 'framer-motion'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";

interface VivaQuestion {
  id: string;
  submissionId: string;
  question: string;
  status: string;
  isLocked: boolean;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<VivaQuestion | null>(
    null
  );
  const [newQuestionText, setNewQuestionText] = useState("");
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
      if (!session?.user?.accessToken) return;
      const apiClient = createApiClient(session.user.accessToken);
      try {
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

  const handleLockToggle = async (questionId: string) => {
    if (!submission) return;
    if (!session?.user?.accessToken) return;
    const apiClient = createApiClient(session.user.accessToken);
    try {
      await apiClient.post(`/viva-questions/${questionId}/toggle-lock`);
      setSubmission({
        ...submission,
        vivaQuestions: submission.vivaQuestions.map((q) =>
          q.id === questionId ? { ...q, isLocked: !q.isLocked } : q
        ),
      });
      toast({
        title: "Success",
        description: "Question lock status updated.",
      });
    } catch (error) {
      console.error("Error toggling question lock:", error);
      toast({
        title: "Error",
        description: "Failed to update question lock status.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerateQuestions = async () => {
    if (!submission) return;
    if (!session?.user?.accessToken) return;
    const apiClient = createApiClient(session.user.accessToken);
    try {
      const response = await apiClient.post(
        `/submissions/${submission.id}/regenerate-viva-questions`
      );
      setSubmission({
        ...submission,
        vivaQuestions: response.data.data,
      });
      toast({
        title: "Success",
        description: "Viva questions regenerated successfully.",
      });
    } catch (error) {
      console.error("Error regenerating questions:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate viva questions.",
        variant: "destructive",
      });
    }
  };

  const handleEditQuestion = (question: VivaQuestion) => {
    setEditingQuestion(question);
    setIsEditModalOpen(true);
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion || !submission) return;
    if (!session?.user?.accessToken) return;
    const apiClient = createApiClient(session.user.accessToken);
    try {
      const response = await apiClient.put(
        `/viva-questions/${editingQuestion.id}`,
        {
          question: editingQuestion.question,
        }
      );
      setSubmission({
        ...submission,
        vivaQuestions: submission.vivaQuestions.map((q) =>
          q.id === editingQuestion.id ? response.data.data : q
        ),
      });
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Question updated successfully.",
      });
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description: "Failed to update question.",
        variant: "destructive",
      });
    }
  };

  const handleAddQuestion = async () => {
    if (!submission || !newQuestionText) return;
    if (!session?.user?.accessToken) return;
    const apiClient = createApiClient(session.user.accessToken);
    try {
      const response = await apiClient.post(
        `/submissions/${submission.id}/viva-questions`,
        {
          question: newQuestionText,
        }
      );
      setSubmission({
        ...submission,
        vivaQuestions: [...submission.vivaQuestions, response.data.data],
      });
      setNewQuestionText("");
      toast({
        title: "Success",
        description: "New question added successfully.",
      });
    } catch (error) {
      console.error("Error adding new question:", error);
      toast({
        title: "Error",
        description: "Failed to add new question.",
        variant: "destructive",
      });
    }
  };

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
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Review Submission</h1>

        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Units</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/units/${params.unitId}`}>...</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}`}>Submissions</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{submission.studentCode ?? 'N/A'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Student ID</Label>
                  <div className="text-lg">{submission.studentCode ?? 'N/A'}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="text-lg">{submission.status}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Viva Status</Label>
                  <div className="text-lg">{submission.vivaStatus}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submission File</Label>
                  <div className="text-lg">{submission.submissionFile}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Submission Content
                <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-full w-[90vw] h-[90vh]">
                    {currentFileContent && (
                      <div className="flex flex-col gap-6 h-full">
                        <DialogHeader>
                          <DialogTitle>Submission Content</DialogTitle>
                        </DialogHeader>
                        <div className="flex-grow">
                          <embed
                            src={currentFileContent}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                            className="rounded-md"
                          />
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full rounded-md border">
                {currentFileContent && (
                  <embed
                    src={currentFileContent}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="rounded-md"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Viva Questions
              <div className="space-x-2">
                <Button onClick={handleRegenerateQuestions}>
                  <RotateCw className="w-4 h-4 mr-2" />
                  Regenerate Unlocked
                </Button>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      value={editingQuestion ? editingQuestion.question : newQuestionText}
                      onChange={(e) =>
                        editingQuestion
                          ? setEditingQuestion({ ...editingQuestion, question: e.target.value })
                          : setNewQuestionText(e.target.value)
                      }
                      placeholder="Enter question here..."
                      className="min-h-[100px]"
                    />
                    <DialogFooter>
                      <Button onClick={editingQuestion ? handleSaveQuestion : handleAddQuestion}>
                        {editingQuestion ? 'Save Changes' : 'Add Question'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submission.vivaQuestions && submission.vivaQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">{question.question}</TableCell>
                      <TableCell>{question.status}</TableCell>
                      <TableCell>
                        <div className="space-x-2 flex flex-row">
                          <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleLockToggle(question.id)}>
                            {question.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button asChild>
          <a href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assignment
          </a>
        </Button>
      </motion.div>
    </div>
  )
}