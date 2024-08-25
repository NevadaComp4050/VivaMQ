import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
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

export default function Dashboard() {
  // In a real application, this data would be fetched from your backend
  const stats = {
    totalUnits: 8,
    activeAssignments: 12,
    pendingVivas: 24,
    activeUsers: 15,
  };

  const recentActivities = [
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
      name: "new_tutor~example.com",
      date: "2023-05-12",
    },
  ];

  const upcomingVivas = [
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

  const pendingTasks = [
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
      <h1 className="text-3xl font-bold mb-6">VivaMQ Dashboard</h1>

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
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
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="capitalize">
                      {activity.type}
                    </TableCell>
                    <TableCell className="capitalize">
                      {activity.action}
                    </TableCell>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {pendingTasks.map((task) => (
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Vivas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingVivas.map((viva) => (
                <TableRow key={viva.id}>
                  <TableCell>{viva.student}</TableCell>
                  <TableCell>{viva.assignment}</TableCell>
                  <TableCell>{viva.date}</TableCell>
                  <TableCell>{viva.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
