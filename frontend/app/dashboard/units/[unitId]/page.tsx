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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label as RechartsLabel,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import createApiClient from "~/lib/api-client";
import { notFound } from "next/navigation";
import { Plus, TrendingUp } from "lucide-react";
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

  const assignmentStats = unit.assignments.map((assignment) => ({
    name: assignment.name,
    submissions: assignment.submissions.length,
    completed: Object.values(assignment.submissionStatuses).filter(
      (status) => status === "completed"
    ).length,
  }));

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

  const chartConfig = {
    colors: COLORS,
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
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAssignment.name}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="aiModel">AI Model</Label>
                <Select
                  value={newAssignment.aiModel}
                  onValueChange={(value) =>
                    setNewAssignment({ ...newAssignment, aiModel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPT-4">GPT-4</SelectItem>
                    <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specs">Specifications</Label>
                <Textarea
                  id="specs"
                  value={newAssignment.specs}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      specs: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="settings">Settings</Label>
                <Input
                  id="settings"
                  value={newAssignment.settings}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      settings: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button type="submit">Create Assignment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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

      <Tabs defaultValue="assignments" className="mb-6">
        <TabsList>
          <TabsTrigger value="assignments">Assignment Statistics</TabsTrigger>
          <TabsTrigger value="vivas">Viva Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="assignments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Assignment Types</CardTitle>
                <CardDescription>
                  Distribution of Assignment Types
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
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
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  {unit.assignments.length} total assignments
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing distribution of assignment types
                </div>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Submissions Distribution</CardTitle>
                <CardDescription>Assignment Submissions</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
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
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  {totalSubmissions} total submissions
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing distribution of assignment submissions
                </div>
              </CardFooter>
            </Card>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Assignment Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={assignmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="submissions" fill="#8884d8" />
                  <Bar dataKey="completed" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vivas">
          <Card>
            <CardHeader>
              <CardTitle>Viva Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total Viva Questions: {unit.vivaQuestionCount}</p>
              <p>No detailed viva statistics available in the provided data.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="p-4 mt-auto">
                  <Link
                    href={`/dashboard/units/${unit.id}/assignments/${assignment.id}`}
                    passHref
                  >
                    <Button className="w-full">View Assignment</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
