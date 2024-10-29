"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { PieChart, Pie, Cell, Label as RechartsLabel } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import createApiClient from "~/lib/api-client";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

interface Assignment {
  id: string;
  name: string;
  specs: string;
  settings: string;
  submissions: any[];
  submissionStatuses: Record<string, any>;
}

interface Unit {
  id: string;
  name: string;
  sessionId: string;
  ownerId: string;
  assignments: Assignment[];
  tutors: any[];
  vivaQuestionCount: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function UnitPage({ params }: { params: { unitId: string } }) {
  const { data: session } = useSession();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isNewAssignmentModalOpen, setIsNewAssignmentModalOpen] =
    useState(false);
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    aiModel: "GPT-4",
    specs: "",
    settings: "language:en,temperature:0.7",
  });

  useEffect(() => {
    const fetchUnit = async () => {
      if (session?.user?.accessToken) {
        const apiClient = createApiClient(session.user.accessToken);
        try {
          const { data } = await apiClient.get(`/units/${params.unitId}`);
          setUnit(data.data);
        } catch (error) {
          console.error("Error fetching unit:", error);
          notFound();
        }
      }
    };

    fetchUnit();
  }, [session, params.unitId]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session?.user?.accessToken) {
      const apiClient = createApiClient(session.user.accessToken);
      try {
        const { data } = await apiClient.post(
          `/units/${params.unitId}/assignments`,
          newAssignment
        );

        setUnit((prevUnit) => {
          if (prevUnit) {
            return {
              ...prevUnit,
              assignments: [...prevUnit.assignments, data.data],
            };
          }
          return prevUnit;
        });
        setIsNewAssignmentModalOpen(false);
        setNewAssignment({
          name: "",
          aiModel: "GPT-4",
          specs: "",
          settings: "language:en,temperature:0.7",
        });
      } catch (error) {
        console.error("Error creating assignment:", error);
      }
    }
  };

  if (!unit) {
    return <div>Loading...</div>;
  }

  const assignmentTypesData = unit.assignments.reduce((acc, assignment) => {
    acc[assignment.settings] = (acc[assignment.settings] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const assignmentTypesPieData = Object.entries(assignmentTypesData).map(
    ([name, value]) => ({ name, value })
  );

  const totalSubmissions = unit.assignments.reduce(
    (total, assignment) => total + assignment.submissions.length,
    0
  );
  const submissionsPieData = unit.assignments.map((assignment) => ({
    name: assignment.name,
    value: assignment.submissions.length,
  }));

  const chartConfig: ChartConfig = {
    theme: COLORS.reduce((acc, color) => {
      acc[color] = { light: color, dark: color };
      return acc;
    }, {} as Record<string, { light: string; dark: string }>),
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Unit: {unit.name}</h1>
        <Dialog
          open={isNewAssignmentModalOpen}
          onOpenChange={setIsNewAssignmentModalOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Assignment
            </Button>
          </DialogTrigger>
          <DialogContent>
            {/* ... (keep the existing dialog content) */}
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Unit Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Session ID: {unit.sessionId}</p>
              <div className="flex space-x-4">
                <div>
                  <strong>Assignments:</strong> {unit.assignments.length}
                </div>
                <div>
                  <strong>Tutors:</strong> {unit.tutors.length}
                </div>
                <div>
                  <strong>Viva Questions:</strong> {unit.vivaQuestionCount}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unit.assignments.map((assignment) => (
                  <Card key={assignment.id} className="flex flex-col h-full">
                    <CardHeader>
                      <CardTitle>{assignment.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="mb-2">
                        <strong>Specs:</strong> {assignment.specs}
                      </p>
                      <p className="mb-2">
                        <strong>Settings:</strong> {assignment.settings}
                      </p>
                      <p>
                        <strong>Submissions:</strong>{" "}
                        {assignment.submissions.length}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link
                        href={`/dashboard/units/${unit.id}/assignments/${assignment.id}`}
                        passHref
                      >
                        <Button className="w-full">View Assignment</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={assignmentTypesPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {assignmentTypesPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                    <RechartsLabel
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {unit.assignments.length}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Assignments
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-4 text-center text-sm">
                <div className="font-medium">
                  {unit.assignments.length} total assignments
                </div>
                <div className="text-muted-foreground">
                  Showing distribution of assignment types
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={submissionsPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {submissionsPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                    <RechartsLabel
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {totalSubmissions}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Submissions
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-4 text-center text-sm">
                <div className="font-medium">
                  {totalSubmissions} total submissions
                </div>
                <div className="text-muted-foreground">
                  Showing distribution of assignment submissions
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
