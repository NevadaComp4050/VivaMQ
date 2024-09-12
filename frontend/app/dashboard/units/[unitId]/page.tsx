"use client";
import { useState, useEffect } from "react";
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

export default function UnitPage({ params }: { params: { unitId: string } }) {
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await fetch(`/api/units/${params.unitId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch unit');
        }
        const data = await response.json();
        setUnit(data);
      } catch (err) {
        setError('Error fetching unit data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [params.unitId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!unit) return <div>No unit found</div>;

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
          <Link href={`/units/${unit.id}/assignments`}>Manage Assignments</Link>
        </Button>
        <Button asChild>
          <Link href={`/units/${unit.id}/tutors`}>Manage Tutors</Link>
        </Button>
      </div>
    </div>
  );
}
