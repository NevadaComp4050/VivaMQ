"use client";

import { useState } from "react";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import { LockIcon, RefreshCwIcon, CheckIcon, XIcon } from "lucide-react";

export default function VivaPage({
  params,
}: {
  params: { unitId: string; assignmentId: string; vivaId: string };
}) {
  const [viva, setViva] = useState({
    id: params.vivaId,
    studentName: "John Doe",
    assignmentName: "Database Normalization",
    submissionDate: "2023-06-10",
    content:
      "This is the content of John's submission about database normalization...",
    questions: [
      {
        id: 1,
        text: "Explain the concept of 3NF in database design.",
        status: "Locked",
      },
      {
        id: 2,
        text: "Describe the differences between 1NF, 2NF, and 3NF.",
        status: "Unlocked",
      },
      {
        id: 3,
        text: "What are the advantages of using BCNF over 3NF?",
        status: "Unlocked",
      },
    ],
  });

  const handleLockQuestion = (questionId: number) => {
    setViva((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? { ...q, status: q.status === "Locked" ? "Unlocked" : "Locked" }
          : q
      ),
    }));
  };

  const handleRegenerateQuestion = (questionId: number) => {
    // Handle question regeneration logic here
    console.log("Regenerating question:", questionId);
  };

  const handleApproveQuestions = () => {
    // Handle question approval logic here
    console.log("Approving all questions for viva:", viva.id);
  };

  const handleMarkComplete = () => {
    // Handle marking viva as complete
    console.log("Marking viva as complete:", viva.id);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Viva: {viva.studentName}</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Viva Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Student Name:</strong> {viva.studentName}
              </div>
              <div>
                <strong>Assignment:</strong> {viva.assignmentName}
              </div>
              <div>
                <strong>Submission Date:</strong> {viva.submissionDate}
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
              <p>{viva.content}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
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
              {viva.questions.map((question) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
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
