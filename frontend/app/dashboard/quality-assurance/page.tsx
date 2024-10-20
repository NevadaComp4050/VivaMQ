"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Link from "next/link";
import { PlusIcon, SearchIcon } from "lucide-react";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

export default function QualityAssurance() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedAssignment, setSelectedAssignmnet] = useState("all");

  const mockAssignments: Assignment[] = [
    {
      id: "1",
      unitId: "unit1",
      name: "Assignment 1",
      description: "Description for Assignment 1",
      dueDate: "2024-10-01",
      submissions: 10,
    },
    {
      id: "2",
      unitId: "unit2",
      name: "Assignment 2",
      description: "Description for Assignment 2",
      dueDate: "2024-10-05",
      submissions: 5,
    },
    {
      id: "3",
      unitId: "unit1",
      name: "Assignment 3",
      description: "Description for Assignment 3",
      dueDate: "2024-10-10",
      submissions: 8,
    },
    {
      id: "4",
      unitId: "unit3",
      name: "Assignment 4",
      description: "Description for Assignment 4",
      dueDate: "2024-10-15",
      submissions: 3,
    },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quality Assurance</h1>
      <div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Existing Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Unit</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedAssignment}
                onValueChange={setSelectedAssignmnet}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Assignmnet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Submission count</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.id}</TableCell>
                    <TableCell>{assignment.name}</TableCell>
                    <TableCell>{assignment.unitId}</TableCell>
                    <TableCell>tofix</TableCell>
                    <TableCell>{assignment.submissions}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={"/dashboard/quality-assurance/view"}>
                          View
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
        <Card>
          <CardHeader>
            <CardTitle>Submissions Stats</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-1/2 ml-auto mr-auto mt-5"
            >
              <BarChart accessibilityLayer data={mockAssignments}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  type="category"
                />
                <YAxis
                  dataKey="submissions"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  type="number"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="submissions"
                  fill="var(--color-desktop)"
                  radius={5}
                  barSize={65}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
