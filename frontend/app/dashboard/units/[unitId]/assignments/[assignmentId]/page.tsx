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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  FileTextIcon,
  UsersIcon,
  FileEditIcon,
  Loader2,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "~/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submissionDate: string;
  status: string;
  pdfSubmission?: {
    fileName: string;
  };
}

interface Assignment {
  id: string;
  name: string;
  description: string;
  dueDate: string;
}

export default function Component({
  params,
}: {
  params: { unitId: string; assignmentId: string };
}) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    fetchAssignmentAndSubmissions();
  }, [params.unitId, params.assignmentId]);

  const fetchAssignmentAndSubmissions = async () => {
    try {
      setLoading(true);
      const [assignmentResponse, submissionsResponse] = await Promise.all([
        fetch(`/api/units/${params.unitId}/assignments/${params.assignmentId}`),
        fetch(
          `/api/units/${params.unitId}/assignments/${params.assignmentId}/submissions`
        ),
      ]);

      if (!assignmentResponse.ok || !submissionsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const assignmentData: Assignment = await assignmentResponse.json();
      const submissionsData: Submission[] = await submissionsResponse.json();

      setAssignment(assignmentData);
      setSubmissions(submissionsData);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !studentId || !studentName) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("assignmentId", params.assignmentId);
    formData.append("studentId", studentId);
    formData.append("studentName", studentName);

    try {
      const response = await fetch("/api/submissions/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload submission");
      }

      toast({
        title: "Success",
        description: "Submission uploaded successfully.",
      });
      setUploadDialogOpen(false);
      fetchAssignmentAndSubmissions();
    } catch (error) {
      console.error("Error uploading submission:", error);
      toast({
        title: "Error",
        description: "Failed to upload submission. Please try again.",
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

  if (!assignment) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Assignment Not Found</h1>
        <p className="text-muted-foreground">
          The requested assignment could not be found.
        </p>
      </div>
    );
  }

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
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p>{assignment.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Due Date</h3>
                  <p>{new Date(assignment.dueDate).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Total Submissions</h3>
                  <p>{submissions.length}</p>
                </div>
                <Button asChild>
                  <Link
                    href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}/rubrics`}
                  >
                    <FileEditIcon className="w-4 h-4 mr-2" />
                    Manage Rubric
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Dialog
                  open={uploadDialogOpen}
                  onOpenChange={setUploadDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Upload Submission
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Submission</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf"
                      />
                      <Input
                        placeholder="Student ID"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                      />
                      <Input
                        placeholder="Student Name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                      />
                      <Button onClick={handleUpload}>Upload</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {submissions.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No submissions yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.studentName}</TableCell>
                        <TableCell>{submission.studentId}</TableCell>
                        <TableCell>
                          {new Date(submission.submissionDate).toLocaleString()}
                        </TableCell>
                        <TableCell>{submission.status}</TableCell>
                        <TableCell>
                          {submission.pdfSubmission?.fileName || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}/submissions/${submission.id}`}
                            >
                              Review
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
