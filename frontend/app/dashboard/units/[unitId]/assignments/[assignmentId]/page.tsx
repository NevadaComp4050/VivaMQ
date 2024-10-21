"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from 'react-dropzone';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Stepper, Step, StepLabel } from "~/components/ui/stepper";
import { toast } from "~/components/ui/use-toast";
import { FileTextIcon, UsersIcon, FileEditIcon, Loader2, UploadIcon, FileIcon, CheckIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import createApiClient from '~/lib/api-client';
import { UploadedFileItem } from "~/components/components/uploaded-file-item";

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

interface UploadedFile {
  id: string;
  name: string;
  studentId?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

export default function AssignmentManagementPage({
  params,
}: {
  params: { unitId: string; assignmentId: string };
}) {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentStudentId, setCurrentStudentId] = useState('');
  const { data: session } = useSession();
  const [pendingMappings, setPendingMappings] = useState<Array<{ submissionId: string, studentId: string }>>([]);
  const [currentFileContent, setCurrentFileContent] = useState<string | null>(null);

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
    const newFiles = acceptedFiles.map(file => ({
      id: '',
      name: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);

    const uploadPromises = acceptedFiles.map(async (file, index) => {
      if (!session?.user?.accessToken) return null;

      const apiClient = createApiClient(session.user.accessToken);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await apiClient.post(`/assignments/${params.assignmentId}/submissionUpload`, formData, {
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadedFiles(prevFiles =>
              prevFiles.map((prevFile, i) =>
                i === prevFiles.length - acceptedFiles.length + index
                  ? { ...prevFile, progress }
                  : prevFile
              )
            );
          },
        });

        const data = response.data.data;
        setUploadedFiles(prevFiles => 
          prevFiles.map((prevFile, i) => 
            i === prevFiles.length - acceptedFiles.length + index
              ? { ...prevFile, id: data.id, progress: 100, status: 'success' as const }
              : prevFile
          )
        );
        return data;
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadedFiles(prevFiles => 
          prevFiles.map((prevFile, i) => 
            i === prevFiles.length - acceptedFiles.length + index
              ? { ...prevFile, progress: 100, status: 'error' as const }
              : prevFile
          )
        );
        toast({
          title: "Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
        return null;
      }
    });

    await Promise.all(uploadPromises);

    toast({
      title: "Upload Complete",
      description: `Uploaded ${acceptedFiles.length} files`,
    });
  }, [params.assignmentId, session]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(`/assignments/${params.assignmentId}/submissionMapping`, formData);
      const mappedSubmissions = response.data.data;

      const bulkMappings = Object.entries(mappedSubmissions).map(([fileName, studentId]) => {
        const submission = uploadedFiles.find(file => file.name === fileName);
        return {
          submissionId: submission?.id,
          studentId: studentId as string
        };
      }).filter(mapping => mapping.submissionId);

      await apiClient.post('/submissions/bulkSubmissionMapping', { mappings: bulkMappings });

      setUploadedFiles(prevFiles => 
        prevFiles.map(file => ({
          ...file,
          studentId: mappedSubmissions[file.name] || file.studentId,
        }))
      );

      toast({
        title: "Success",
        description: "CSV processed and submissions mapped successfully",
      });

      setActiveStep(2); // Change this from 3 to 2
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: "Error",
        description: "Failed to process CSV or map submissions",
        variant: "destructive",
      });
    }
  };

  const handleStudentIdSubmit = async () => {
    if (!currentStudentId.trim() || !session?.user?.accessToken) {
      toast({
        title: "Error",
        description: "Please enter a valid Student ID",
        variant: "destructive",
      });
      return;
    }

    const apiClient = createApiClient(session.user.accessToken);
    const currentFile = uploadedFiles[currentFileIndex];

    setPendingMappings(prev => [...prev, { submissionId: currentFile.id, studentId: currentStudentId.trim() }]);

    setUploadedFiles(prevFiles => 
      prevFiles.map((file, index) => 
        index === currentFileIndex ? { ...file, studentId: currentStudentId.trim() } : file
      )
    );

    if (currentFileIndex < uploadedFiles.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
      setCurrentStudentId('');
    } else {
      try {
        await apiClient.post('/submissions/bulkSubmissionMapping', { mappings: [...pendingMappings, { submissionId: currentFile.id, studentId: currentStudentId.trim() }] });
        
        setActiveStep(2); // Change this from 3 to 2
        toast({
          title: "Success",
          description: "All files have been assigned student IDs",
        });
        setPendingMappings([]);
      } catch (error) {
        console.error('Error mapping student IDs:', error);
        toast({
          title: "Error",
          description: "Failed to assign student IDs. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleStudentIdSubmit();
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    try {
      await apiClient.delete(`/submissions/${submissionId}`);
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
      fetchAssignment();
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete submission. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchFileContent = useCallback(async (fileId: string) => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    try {
      const response = await apiClient.get(`submissions/${fileId}/file`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setCurrentFileContent(url);
    } catch (error) {
      console.error('Error fetching file content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch file content. Please try again.",
        variant: "destructive",
      });
    }
  }, [session]);

  useEffect(() => {
    if (uploadedFiles[currentFileIndex]?.id) {
      fetchFileContent(uploadedFiles[currentFileIndex].id);
    }

    return () => {
      if (currentFileContent) {
        URL.revokeObjectURL(currentFileContent);
      }
    };
  }, [currentFileIndex, uploadedFiles, fetchFileContent]);


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
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Assignment: {assignment.name}</h1>

      <Tabs defaultValue={activeStep === 0 ? "view" : "upload"} className="mb-8">
        <TabsList>
          <TabsTrigger value="view">View Submissions</TabsTrigger>
          <TabsTrigger value="upload">Upload New Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Existing Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {assignment.submissions.length === 0 ? (
                <p className="text-center text-muted-foreground">No submissions yet.</p>
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
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}/submissions/${submission.id}`}>
                                Review
                              </Link>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteSubmission(submission.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upload">
          <Stepper activeStep={activeStep} className="mb-8">
            <Step>
              <StepLabel>Upload Submissions</StepLabel>
            </Step>
            <Step>
              <StepLabel>Map Student IDs</StepLabel>
            </Step>
            <Step>
              <StepLabel>Review and Confirm</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the PDF files here ...</p>
                  ) : (
                    <>
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">Drag 'n' drop some PDF files here, or click to select files</p>
                    </>
                  )}
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <UploadedFileItem
                          key={index}
                          name={file.name}
                          studentId={file.studentId}
                          progress={file.progress}
                          status={file.status}
                        />
                      ))}
                    </ul>
                    {uploadedFiles.every(file => file.status === 'success') && (
                      <Button className="mt-4" onClick={() => setActiveStep(1)}>
                        Proceed to Map Student IDs
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Map Student IDs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button asChild>
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload CSV with Student IDs
                    </label>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">Student ID for {uploadedFiles[currentFileIndex]?.name}</Label>
                    <Input
                      id="studentId"
                      placeholder="Enter student ID"
                      value={currentStudentId}
                      onChange={(e) => setCurrentStudentId(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button className="mt-4" onClick={handleStudentIdSubmit}>
                      {currentFileIndex < uploadedFiles.length - 1 ? 'Next' : 'Finish'}
                    </Button>
                  </div>
                  <div>
                    <div className="w-full h-96 border border-gray-300 rounded overflow-hidden">
                      {currentFileContent ? (
                        <embed 
                          src={currentFileContent} 
                          type="application/pdf" 
                          width="100%" 
                          height="100%"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Review and Confirm</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>{file.name}</TableCell>
                        <TableCell>{file.studentId || 'Not assigned'}</TableCell>
                        <TableCell>
                          {file.status === 'success' ? (
                            <CheckIcon className="text-green-500" />
                          ) : (
                            <FileIcon className="text-red-500" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button className="mt-4" onClick={() => {
                  fetchAssignment();
                  setActiveStep(0);
                  setUploadedFiles([]);
                }}>
                  Confirm and Finish
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}