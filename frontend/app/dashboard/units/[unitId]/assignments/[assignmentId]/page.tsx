"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
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
import { Loader2, UploadIcon, FileIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import createApiClient from "~/lib/api-client";
import { UploadedFileItem } from "~/components/components/uploaded-file-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string | null;
  studentCode?: string;
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
  status: "uploading" | "success" | "error";
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
  const [currentStudentId, setCurrentStudentId] = useState("");
  const { data: session } = useSession();
  const [pendingMappings, setPendingMappings] = useState<
    Array<{ submissionId: string; studentId: string }>
  >([]);
  const [currentFileContent, setCurrentFileContent] = useState<string | null>(
    null
  );
  const [unmappedFiles, setUnmappedFiles] = useState<UploadedFile[]>([]);
  const [duplicateEntries, setDuplicateEntries] = useState<string[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const fileContentRef = useRef<string | null>(null);

  const fetchAssignment = useCallback(async () => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/assignments/${params.assignmentId}`
      );
      setAssignment(response.data.data);

      console.log(response.data.data);
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

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: "",
        name: file.name,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

      const uploadPromises = acceptedFiles.map(async (file, index) => {
        if (!session?.user?.accessToken) return null;

        const apiClient = createApiClient(session.user.accessToken);
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await apiClient.post(
            `/assignments/${params.assignmentId}/submissionUpload`,
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const progress = progressEvent.total
                  ? Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    )
                  : 0;
                setUploadedFiles((prevFiles) =>
                  prevFiles.map((prevFile, i) =>
                    i === prevFiles.length - acceptedFiles.length + index
                      ? { ...prevFile, progress }
                      : prevFile
                  )
                );
              },
            }
          );

          const data = response.data.data;
          setUploadedFiles((prevFiles) =>
            prevFiles.map((prevFile, i) =>
              i === prevFiles.length - acceptedFiles.length + index
                ? {
                    ...prevFile,
                    id: data.id,
                    progress: 100,
                    status: "success" as const,
                  }
                : prevFile
            )
          );
          return data;
        } catch (error) {
          console.error("Error uploading file:", error);
          setUploadedFiles((prevFiles) =>
            prevFiles.map((prevFile, i) =>
              i === prevFiles.length - acceptedFiles.length + index
                ? { ...prevFile, progress: 100, status: "error" as const }
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
    },
    [params.assignmentId, session]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  const handleCsvUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.accessToken) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/process-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.duplicates) {
          setDuplicateEntries(errorData.duplicates);
          setShowDuplicateModal(true);
          return;
        } else {
          throw new Error("Failed to process CSV");
        }
      }

      const mappedSubmissions = await response.json();

      // Normalize file names to handle case sensitivity and whitespace
      const normalizedMappings: Record<string, string> = {};
      for (const [fileName, studentId] of Object.entries(mappedSubmissions)) {
        normalizedMappings[fileName.trim().toLowerCase()] = studentId.trim();
      }

      const mappedFiles = uploadedFiles.filter((file) => {
        const normalizedFileName = file.name.trim().toLowerCase();
        return normalizedMappings[normalizedFileName];
      });

      const unmappedFilesLocal = uploadedFiles.filter((file) => {
        const normalizedFileName = file.name.trim().toLowerCase();
        return !normalizedMappings[normalizedFileName];
      });

      setUploadedFiles(
        mappedFiles.map((file) => ({
          ...file,
          studentId: normalizedMappings[file.name.trim().toLowerCase()],
        }))
      );

      setUnmappedFiles(unmappedFilesLocal);

      setPendingMappings(
        mappedFiles.map((file) => ({
          submissionId: file.id,
          studentId: normalizedMappings[file.name.trim().toLowerCase()],
        }))
      );

      toast({
        title: "Success",
        description: "CSV processed successfully",
      });

      if (unmappedFilesLocal.length > 0) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast({
        title: "Error",
        description: "Failed to process CSV",
        variant: "destructive",
      });
    }
  };

  const handleSkipCsvUpload = () => {
    setUnmappedFiles(uploadedFiles);
    setUploadedFiles([]);
    setActiveStep(2);
  };

  const handleStudentIdSubmit = () => {
    if (!currentStudentId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Student ID",
        variant: "destructive",
      });
      return;
    }

    const currentFile = unmappedFiles[currentFileIndex];

    setPendingMappings((prev) => [
      ...prev,
      { submissionId: currentFile.id, studentId: currentStudentId.trim() },
    ]);

    setUnmappedFiles((prevFiles) =>
      prevFiles.map((file, index) =>
        index === currentFileIndex
          ? { ...file, studentId: currentStudentId.trim() }
          : file
      )
    );

    if (currentFileIndex < unmappedFiles.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
      setCurrentStudentId("");
    } else {
      setActiveStep(3);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
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

      // Optimistically update the local state
      setAssignment((prevAssignment) => {
        if (!prevAssignment) return prevAssignment;
        return {
          ...prevAssignment,
          submissions: prevAssignment.submissions.filter(
            (sub) => sub.id !== submissionId
          ),
        };
      });
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast({
        title: "Error",
        description: "Failed to delete submission. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    [session]
  );

  const handleConfirmAndFinish = async () => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    try {
      await apiClient.post("/submissions/bulkSubmissionMapping", {
        mappings: pendingMappings,
      });

      toast({
        title: "Success",
        description: "All files have been assigned student IDs",
      });

      fetchAssignment();
      setActiveStep(0);
      setUploadedFiles([]);
      setUnmappedFiles([]);
      setPendingMappings([]);
    } catch (error) {
      console.error("Error mapping student IDs:", error);
      toast({
        title: "Error",
        description: "Failed to assign student IDs. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDiscardCsv = () => {
    setUploadedFiles((prevFiles) =>
      prevFiles.map((file) => ({
        ...file,
        studentId: undefined,
      }))
    );
    setPendingMappings([]);
    setUnmappedFiles([]);
    setActiveStep(1); // Stay on the CSV upload step
    setShowDiscardModal(false);
    toast({
      title: "CSV Upload Discarded",
      description: "You can re-upload a corrected CSV file.",
    });
  };

  const processMappingsWithoutDuplicates = () => {
    // Remove duplicates from uploadedFiles based on duplicateEntries
    const filteredUploadedFiles = uploadedFiles.filter(
      (file) =>
        !duplicateEntries
          .map((name) => name.trim().toLowerCase())
          .includes(file.name.trim().toLowerCase())
    );

    setUploadedFiles(filteredUploadedFiles);

    // Proceed as normal
    toast({
      title: "Proceeding Without Duplicates",
      description:
        "Duplicate entries have been removed and mappings are being processed.",
    });

    if (unmappedFiles.length > 0) {
      setActiveStep(2);
    } else {
      setActiveStep(3);
    }
  };

  useEffect(() => {
    if (unmappedFiles[currentFileIndex]?.id) {
      fetchFileContent(unmappedFiles[currentFileIndex].id);
    }

    return () => {
      if (fileContentRef.current) {
        URL.revokeObjectURL(fileContentRef.current);
        fileContentRef.current = null;
      }
    };
  }, [currentFileIndex, unmappedFiles, fetchFileContent]);

  const mappedSubmissions = uploadedFiles.filter((file) => file.studentId);
  const remainingUnmappedSubmissions = unmappedFiles;

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

      <Tabs
        defaultValue={activeStep === 0 ? "view" : "upload"}
        className="mb-8"
      >
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
                        <TableCell>
                          {submission.submissionFile.split("/").pop()}
                        </TableCell>
                        <TableCell>
                          {submission.studentCode ?? "Not assigned"}
                        </TableCell>
                        <TableCell>{submission.status}</TableCell>
                        <TableCell>{submission.vivaStatus}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/dashboard/units/${params.unitId}/assignments/${params.assignmentId}/submissions/${submission.id}`}
                              >
                                Review
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteSubmission(submission.id)
                              }
                            >
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
              <StepLabel>Upload CSV or Skip</StepLabel>
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
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the PDF files here ...</p>
                  ) : (
                    <>
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2">
                        Drag 'n' drop some PDF files here, or click to select
                        files
                      </p>
                    </>
                  )}
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Uploaded Files
                    </h3>
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                      {uploadedFiles.map((file) => (
                        <UploadedFileItem
                          key={file.name || file.id}
                          name={file.name}
                          studentId={file.studentId}
                          progress={file.progress}
                          status={file.status}
                        />
                      ))}
                    </ul>
                  </div>
                )}

                {uploadedFiles.length > 0 && (
                  // check all files have been uploaded
                  <Button
                    className="mt-4"
                    onClick={() => setActiveStep(1)}
                    disabled={uploadedFiles.some(
                      (file) => file.status === "uploading"
                    )}
                  >
                    Next
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV or Skip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
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
                  <Button variant="outline" onClick={handleSkipCsvUpload}>
                    Skip CSV Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Map Student IDs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentId">
                      Student ID for {unmappedFiles[currentFileIndex]?.name}
                    </Label>
                    <Input
                      id="studentId"
                      placeholder="Enter student ID"
                      value={currentStudentId}
                      onChange={(e) => setCurrentStudentId(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button className="mt-4" onClick={handleStudentIdSubmit}>
                      {currentFileIndex < unmappedFiles.length - 1
                        ? "Next"
                        : "Finish"}
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
                          onError={() => {
                            toast({
                              title: "Error",
                              description: "Failed to load PDF.",
                              variant: "destructive",
                            });
                          }}
                        />
                      ) : (
                        <div className="flexi tems-center justify-center h-full">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review and Confirm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    CSV Mapped Submissions
                  </h3>
                  {mappedSubmissions.length === 0 ? (
                    <p className="text-muted-foreground">
                      No submissions have been mapped.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mappedSubmissions.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>
                              {file.studentId ?? "Not assigned"}
                            </TableCell>
                            <TableCell>
                              {file.status === "success" ? (
                                <CheckIcon className="text-green-500" />
                              ) : (
                                <FileIcon className="text-red-500" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Manually Mapped Submissions
                  </h3>
                  {remainingUnmappedSubmissions.length === 0 ? (
                    <p className="text-muted-foreground">
                      All submissions have been mapped.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File Name</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {remainingUnmappedSubmissions.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell>{file.name}</TableCell>
                            <TableCell>
                              {file.studentId ?? "Not assigned"}
                            </TableCell>
                            <TableCell>
                              {file.status === "success" ? (
                                <CheckIcon className="text-green-500" />
                              ) : (
                                <FileIcon className="text-red-500" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setActiveStep(2)}
                  className="mr-4"
                >
                  Back
                </Button>
                <Button className="mt-4" onClick={handleConfirmAndFinish}>
                  Confirm and Finish
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Duplicate Entries Modal */}
      <Dialog open={showDuplicateModal} onOpenChange={setShowDuplicateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Entries in CSV</DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            The following filenames are duplicated in the CSV:
          </p>
          <ul className="list-disc list-inside mb-4">
            {duplicateEntries.map((fileName, index) => (
              <li key={index}>{fileName}</li>
            ))}
          </ul>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                setDuplicateEntries([]);
                setShowDuplicateModal(false);
                setShowDiscardModal(true);
              }}
            >
              Discard CSV
            </Button>
            <Button
              onClick={() => {
                processMappingsWithoutDuplicates();
                setDuplicateEntries([]);
                setShowDuplicateModal(false);
              }}
            >
              Proceed (Remove Duplicates)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discard Confirmation Modal */}
      <Dialog open={showDiscardModal} onOpenChange={setShowDiscardModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Discard</DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            Are you sure you want to discard your CSV upload? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDiscardModal(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDiscardCsv}>
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
