"use client";

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

import Link from "next/link";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

import { useState } from "react";

import { SearchIcon } from "lucide-react";

import { Label } from "~/components/ui/label";

import { ScrollArea } from "~/components/ui/scroll-area";

export default function QualityAssuranceViewDetails() {
  interface Unit {
    id: string;
    name: string;
    code: string;
    year: string;
    session: string;
  }

  interface Assignment {
    id: string;
    unitId: string;
    name: string;
    description?: string;
    dueDate?: string;
    submissions?: number;
  }
  interface Submission {
    id: string;
    assignmentId: string;
    studentName: string;
    submissionDate: string;
    status: string;
    content: string;
  }

  interface WritingQuality {
    structure: string;
    grammar: string;
    spelling: string;
    vocabulary: string;
    overall_quality: string;
    recommendations: string[];
  }

  const mockWritingQuality: WritingQuality = {
    structure: "Good",
    grammar: "Excellent",
    spelling: "Fair",
    vocabulary: "Rich",
    overall_quality: "Very Good",
    recommendations: [
      "Improve spelling",
      "Use more varied sentence structures",
    ],
  };

  const mockSubmission: Submission = {
    id: "1",
    assignmentId: "1",
    studentName: "John Doe",
    submissionDate: "2024-10-01",
    status: "Reviewed",
    content: "This is the content of the submission.",
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Review Submission: {mockSubmission.studentName}
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
                <div>{mockSubmission.studentName}</div>
              </div>
              <div>
                <Label>Assignment</Label>
                {/* <div>{assignmentName}</div> */}
              </div>
              <div>
                <Label>Submission Date</Label>
                <div>{mockSubmission.submissionDate}</div>
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
              <p>{mockSubmission.content}</p>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button> Regenrate Quality Assurance Review</Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criterion</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(mockWritingQuality).map(([criterion, feedback]) => {
                    // lazily format the criterion
                    const formattedCriterion = criterion
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, char => char.toUpperCase());
                    return (
                      <TableRow key={criterion}>
                        <TableCell>{formattedCriterion}</TableCell>
                        <TableCell>
                          {Array.isArray(feedback) ? (
                            feedback.map((recommendation, index) => (
                              <div key={index}>{recommendation}</div>
                            ))
                          ) : (
                            <Input defaultValue={feedback} />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
