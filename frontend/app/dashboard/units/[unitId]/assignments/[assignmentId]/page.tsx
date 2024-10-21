"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from 'react-dropzone';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import { FileTextIcon, UsersIcon, FileEditIcon, Loader2, UploadIcon } from "lucide-react";
import Link from "next/link";
import createApiClient from '~/lib/api-client';

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string | null;
  submissionFile: string;
  status: string;
  vivaStatus: string;
}

interface Assignment {
  id: string;
  name: string;
  specs: string;
  settings: string;
  unitId: string;
  submissions: Submission[];
}

export default function AssignmentManagementPage({
  params,
}: {
  params: { unitId: string; assignmentId: string };
}) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { data: session } = useSession();

  const fetchAssignment = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    try {
      setLoading(true);
      const response = await apiClient.get(`/assignments/${params.assignmentId}`);
      setAssignment(response.data.data);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assignment data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params.assignmentId, session]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    const uploadPromises = acceptedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post(`/assignments/${params.assignmentId}/submissionUpload`, formData);
        return response.data.data;
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((result): result is Submission => result !== null);

    if (successfulUploads.length > 0) {
      setAssignment(prev => prev ? {
        ...prev,
        submissions: [...prev.submissions, ...successfulUploads]
      } : null);
      toast({
        title: "Success",
        description: `Uploaded ${successfulUploads.length} files`,
      });
    }

    setUploadDialogOpen(false);
  }, [params.assignmentId, session]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCsvUpload = async () => {
    if (!csvFile || !session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await apiClient.post(`/assignments/${params.assignmentId}/submissionMapping`, formData);
      const mappedSubmissions = response.data.data;

      setAssignment(prev => prev ? {
        ...prev,
        submissions: prev.submissions.map(sub => {
          const mapped = mappedSubmissions.find((m: Submission) => m.id === sub.id);
          return mapped || sub;
        })
      } : null);

      toast({
        title: "Success",
        description: "CSV processed and submissions mapped successfully",
      });
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: "Error",
        description: "Failed to process CSV",
        variant: "destructive",
      });
    }

    setCsvDialogOpen(false);
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
                  <h3 className="font-semibold">Specifications</h3>
                  <p>{assignment.specs}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Settings</h3>
                  <p>{assignment.settings}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Total Submissions</h3>
                  <p>{assignment.submissions.length}</p>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}/rubrics`}>
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
              <div className="flex space-x-4 mb-4">
                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Upload Submissions
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Submissions</DialogTitle>
                    </DialogHeader>
                    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the PDF files here ...</p>
                      ) : (
                        <p>Drag 'n' drop some PDF files here, or click to select files</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Upload CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload CSV for Student ID Mapping</DialogTitle>
                    </DialogHeader>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
                    />
                    <Button onClick={handleCsvUpload}>Process CSV</Button>
                  </DialogContent>
                </Dialog>
              </div>

              {assignment.submissions.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No submissions yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission File</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Viva Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignment.submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.submissionFile.split('/').pop()}</TableCell>
                        <TableCell>{submission.studentId || 'Not assigned'}</TableCell>
                        <TableCell>{submission.status}</TableCell>
                        <TableCell>{submission.vivaStatus}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}/submissions/${submission.id}`}>
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