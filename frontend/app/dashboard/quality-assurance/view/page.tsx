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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { useState } from "react";
import { SearchIcon } from "lucide-react";

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

export default function QualityAssuranceView() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockSubmissions: Submission[] = [
    {
      id: "1",
      assignmentId: "101",
      studentName: "John Doe",
      submissionDate: "2023-10-01",
      status: "Submitted",
      content: "This is the content of the submission by John Doe.",
    },
    {
      id: "2",
      assignmentId: "102",
      studentName: "Jane Smith",
      submissionDate: "2023-10-02",
      status: "Pending",
      content: "This is the content of the submission by Jane Smith.",
    },
    {
      id: "3",
      assignmentId: "103",
      studentName: "Alice Johnson",
      submissionDate: "2023-10-03",
      status: "Reviewed",
      content: "This is the content of the submission by Alice Johnson.",
    },
    {
      id: "4",
      assignmentId: "104",
      studentName: "Bob Brown",
      submissionDate: "2023-10-04",
      status: "Submitted",
      content: "This is the content of the submission by Bob Brown.",
    },
  ];

  const totalSubmissionsReviewed = mockSubmissions.filter(
    (submission) => submission.status === "Reviewed"
  ).length;
  const totalSubmissionsPending = mockSubmissions.filter(
    (submission) => submission.status === "Pending"
  ).length;
  const totalSubmissionsSubmitted = mockSubmissions.filter(
    (submission) => submission.status === "Submitted"
  ).length;

  const createSumDataset = () => {
    return [
      {
        submStatus: "Reviewed",
        count: totalSubmissionsReviewed,
        fill: "var(--color-reviewed)",
      },
      {
        submStatus: "Pending",
        count: totalSubmissionsPending,
        fill: "var(--color-pending)",
      },
      {
        submStatus: "Submitted",
        count: totalSubmissionsSubmitted,
        fill: "var(--color-submitted)",
      },
    ];
  };
  const totalData = createSumDataset();

  const chartConfig = {
    reviewed: {
      label: "Reviewed",
      color: "hsl(var(--chart-1))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-2))",
    },
    submitted: {
      label: "Submitted",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quality Assurance</h1>
      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Submission..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell>{submission.status}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={"/dashboard/quality-assurance/view/details"}
                        >
                          Details
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle>Submission Status Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[400px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={totalData} dataKey="count" nameKey="submStatus" />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
