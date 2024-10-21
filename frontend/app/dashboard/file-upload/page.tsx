"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "~/components/ui/use-toast";
import { UploadedFileItem } from "~/components/components/uploaded-file-item";

interface UploadedFile {
  id: string;
  name: string;
  studentId?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

export default function FileUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentStudentId, setCurrentStudentId] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: '',
      name: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);

    const uploadPromises = acceptedFiles.map(async (file, index) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        setUploadedFiles(prevFiles => 
          prevFiles.map((prevFile, i) => 
            i === prevFiles.length - acceptedFiles.length + index
              ? { ...prevFile, id: data.id, progress: 100, status: 'success' as const }
              : prevFile
          )
        );

        return { id: data.id, name: file.name, progress: 100, status: 'success' as const };
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('CSV processing failed');
      }

      const data = await response.json();
      
      setUploadedFiles(prevFiles => 
        prevFiles.map(file => ({
          ...file,
          studentId: data[file.name] || file.studentId,
        }))
      );

      const unmatchedFiles = uploadedFiles.filter(file => !data[file.name]);
      if (unmatchedFiles.length > 0) {
        toast({
          title: "Warning",
          description: `${unmatchedFiles.length} files couldn't be matched. Please use the wizard to assign their student IDs.`,
          variant: "warning",
        });
        setShowWizard(true);
      } else {
        toast({
          title: "Success",
          description: "All files have been matched with student IDs",
        });
      }
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: "Error",
        description: "Failed to process CSV",
        variant: "destructive",
      });
    }
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

    setUploadedFiles(prevFiles => 
      prevFiles.map((file, index) => 
        index === currentFileIndex ? { ...file, studentId: currentStudentId } : file
      )
    );

    if (currentFileIndex < uploadedFiles.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
      setCurrentStudentId('');
    } else {
      setShowWizard(false);
      toast({
        title: "Success",
        description: "All files have been assigned student IDs",
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleStudentIdSubmit();
    }
  };

  const unmatchedFiles = uploadedFiles.filter(file => !file.studentId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Upload</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Upload PDF Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the PDF files here ...</p>
            ) : (
              <p>Drag 'n' drop some PDF files here, or click to select files</p>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {uploadedFiles.length > 0 && !showCsvUpload && !showWizard && (
        <div className="flex justify-center space-x-4">
          <Button onClick={() => setShowCsvUpload(true)}>Upload CSV</Button>
          <Button onClick={() => setShowWizard(true)}>Use Wizard</Button>
        </div>
      )}

      {showCsvUpload && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Upload CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="file" accept=".csv" onChange={handleCsvUpload} />
          </CardContent>
        </Card>
      )}

      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assign Student IDs</DialogTitle>
            <DialogDescription>
              Please enter the student ID for each file and press Enter or click Next/Finish.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            <div className="overflow-y-auto max-h-96">
              <Tabs value={currentFileIndex.toString()} onValueChange={(value) => setCurrentFileIndex(parseInt(value))}>
                <TabsList className="grid grid-cols-1 h-full">
                  {unmatchedFiles.map((file, index) => (
                    <TabsTrigger key={index} value={index.toString()} className="justify-start">
                      {file.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="Enter student ID"
                value={currentStudentId}
                onChange={(e) => setCurrentStudentId(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button className="mt-4" onClick={handleStudentIdSubmit}>
                {currentFileIndex < unmatchedFiles.length - 1 ? 'Next' : 'Finish'}
              </Button>
            </div>
            <div>
              <iframe
                src={`/api/pdf-preview/${unmatchedFiles[currentFileIndex]?.id}`}
                className="w-full h-96 border border-gray-300 rounded"
                title={`PDF Preview: ${unmatchedFiles[currentFileIndex]?.name}`}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}