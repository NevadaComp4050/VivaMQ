"use client";
import { useState } from "react";
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
  const [unit, setUnit] = useState({
    id: params.unitId,
    name: "Advanced Database Systems",
    description:
      "This unit covers advanced topics in database systems including normalization, query optimization, and distributed databases.",
    assignments: 3,
    tutors: 2,
    assignmentStats: [
      { name: "Assignment 1", submissions: 45, completed: 40, average: 75 },
      { name: "Assignment 2", submissions: 42, completed: 38, average: 72 },
      { name: "Assignment 3", submissions: 40, completed: 35, average: 78 },
    ],
    vivaStats: [
      { name: "Viva 1", scheduled: 40, completed: 35, averageScore: 80 },
      { name: "Viva 2", scheduled: 38, completed: 33, averageScore: 75 },
      { name: "Viva 3", scheduled: 35, completed: 30, averageScore: 82 },
    ],
  });

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
