"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  BookOpenIcon,
  FileTextIcon,
  UsersIcon,
  CalendarIcon,
  AlertCircleIcon,
} from "lucide-react";

interface Stats {
  totalUnits: number;
  activeAssignments: number;
  pendingVivas: number;
  activeUsers: number;
}

interface Activity {
  id: number;
  type: string;
  action: string;
  name: string;
  date: string;
}

interface Viva {
  id: number;
  student: string;
  assignment: string;
  date: string;
  time: string;
}

interface Task {
  id: number;
  task: string;
  dueDate: string;
}

function StatCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Units</CardTitle>
          <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUnits}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Assignments
          </CardTitle>
          <FileTextIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeAssignments}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Vivas</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingVivas}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecentActivities({ activities }: { activities: Activity[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="capitalize">{activity.type}</TableCell>
                <TableCell className="capitalize">{activity.action}</TableCell>
                <TableCell>{activity.name}</TableCell>
                <TableCell>{activity.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PendingTasks({ tasks }: { tasks: Task[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-start space-x-2">
              <AlertCircleIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{task.task}</p>
                <p className="text-xs text-muted-foreground">
                  Due: {task.dueDate}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function UpcomingVivas({ vivas }: { vivas: Viva[] }) {
  return (
   <></>
  );
}

export default function Dashboard() {

  const stats: Stats = {
    totalUnits: 6,
    activeAssignments: 9,
    pendingVivas: 42,
    activeUsers: 0,
  };

  const recentActivities: Activity[] = [
    {
      id: 1,
      type: "unit",
      action: "created",
      name: "Advanced Machine Learning",
      date: "2023-05-15",
    },
    {
      id: 2,
      type: "assignment",
      action: "updated",
      name: "Database Normalization",
      date: "2023-05-14",
    },
    {
      id: 3,
      type: "viva",
      action: "completed",
      name: "John Doe - Software Engineering",
      date: "2023-05-13",
    },
    {
      id: 4,
      type: "user",
      action: "added",
      name: "new_tutor@example.com",
      date: "2023-05-12",
    },
  ];

  const upcomingVivas: Viva[] = [
    {
      id: 1,
      student: "Alice Johnson",
      assignment: "Data Structures",
      date: "2023-05-20",
      time: "10:00 AM",
    },
    {
      id: 2,
      student: "Bob Smith",
      assignment: "Web Development",
      date: "2023-05-21",
      time: "2:00 PM",
    },
    {
      id: 3,
      student: "Charlie Brown",
      assignment: "Artificial Intelligence",
      date: "2023-05-22",
      time: "11:00 AM",
    },
  ];

  const pendingTasks: Task[] = [
    {
      id: 1,
      task: "Review generated questions for Database Systems",
      dueDate: "2023-05-18",
    },
    {
      id: 2,
      task: "Approve viva schedule for Software Engineering",
      dueDate: "2023-05-19",
    },
    {
      id: 3,
      task: "Upload student submissions for Machine Learning",
      dueDate: "2023-05-20",
    },
  ];


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Hello {"user.name"}</h1>

      <StatCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <RecentActivities activities={recentActivities} />
        <PendingTasks tasks={pendingTasks} />
      </div>

      <UpcomingVivas vivas={upcomingVivas} />
    </div>
  );
}