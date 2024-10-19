import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { auth } from "~/auth";
import api from "~/lib/api";
import { notFound } from "next/navigation";

interface Unit {
  id: string;
  name: string;
  description: string;
  assignments: number;
  tutors: number;
  assignmentStats: Array<{
    name: string;
    submissions: number;
    completed: number;
    average: number;
  }>;
  vivaStats: Array<{
    name: string;
    scheduled: number;
    completed: number;
    averageScore: number;
  }>;
}

async function getUnit(unitId: string): Promise<Unit> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error('Not authenticated');
  }

  try {
    const { data } = await api.get(`/units/${unitId}`);
    return data;
  } catch (error) {
    console.error("Error fetching unit:", error);
    throw new Error('Failed to fetch unit');
  }
}

export default async function UnitPage({ params }: { params: { unitId: string } }) {
  let unit: Unit;

  try {
    unit = await getUnit(params.unitId);
  } catch (error) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Unit: {unit.name}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Unit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{unit.description}</p>
          <div className="flex space-x-4">
            <div>
              <strong>Assignments:</strong> {unit.assignments}
            </div>
            <div>
              <strong>Tutors:</strong> {unit.tutors}
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
          <Card>
            <CardHeader>
              <CardTitle>Assignment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={unit.assignmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="submissions"
                    fill="#8884d8"
                    name="Total Submissions"
                  />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                  <Bar dataKey="average" fill="#ffc658" name="Average Score" />
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={unit.vivaStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scheduled" fill="#8884d8" name="Scheduled" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                  <Bar
                    dataKey="averageScore"
                    fill="#ffc658"
                    name="Average Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex space-x-4">
        <Button asChild>
          <Link href={`/dashboard/units/${unit.id}/assignments`}>Manage Assignments</Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/units/${unit.id}/tutors`}>Manage Tutors</Link>
        </Button>
      </div>
    </div>
  );
}