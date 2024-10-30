import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Link from "next/link";
import api from "~/lib/api";
import { auth } from "~/auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { FileText, Book, Clock, ExternalLink } from "lucide-react";

type Unit = {
  id: string;
  name: string;
  sessionId: string;
  ownerId: string;
  accessType: string;
};

type Session = {
  id: string;
  displayName: string;
  year: number;
  term: string;
  units: Unit[];
};

type Activity = {
  type: "rubric" | "assignment";
  id: string;
  unitId?: string;
  name: string;
  latestDate: string;
  reason: string;
};

async function getUnits(): Promise<Session[]> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    const { data } = await api.get("/units/by-session");
    return data.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw new Error("Failed to fetch units");
  }
}

async function getDashboard() {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    const { data } = await api.get("/user/me");
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error("Failed to fetch dashboard data");
  }
}

async function getRecentActivities(): Promise<Activity[]> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    const { data } = await api.get("/activity");
    return data.data;
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    throw new Error("Failed to fetch recent activities");
  }
}

export default async function DashboardPage() {
  let sessions: Session[] = [];
  let activities: Activity[] = [];
  let error: string | null = null;
  let name: string | null = null;

  try {
    sessions = await getUnits();
    const dashboard = await getDashboard();
    name = dashboard.name;
    activities = await getRecentActivities();
  } catch (e) {
    error = e instanceof Error ? e.message : "An unknown error occurred";
  }

  const quickLinks = [
    { name: "Create New Unit", href: "/dashboard/units/new", icon: Book },
    {
      name: "Create New Rubric",
      href: "/dashboard/rubrics/new",
      icon: FileText,
    },
    { name: "View All Units", href: "/dashboard/units", icon: ExternalLink },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome
        {name ? `, ${name}` : ""}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Units</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <Accordion
                  type="multiple"
                  defaultValue={sessions.map((session) => session.id)}
                  className="w-full"
                >
                  {sessions.length > 0 &&
                    sessions.map((session) => (
                      <AccordionItem key={session.id} value={session.id}>
                        <AccordionTrigger>
                          {session.displayName}
                        </AccordionTrigger>
                        <AccordionContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/3">
                                  Unit Name
                                </TableHead>
                                <TableHead className="w-1/3">
                                  Access Type
                                </TableHead>
                                <TableHead className="w-1/3">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {session.units && session.units.length > 0 ? (
                                session.units.map((unit: Unit) => (
                                  <TableRow key={unit.id}>
                                    <TableCell className="w-1/3">
                                      <div
                                        className="truncate"
                                        title={unit.name}
                                      >
                                        {unit.name}
                                      </div>
                                    </TableCell>
                                    <TableCell className="w-1/3">
                                      <div
                                        className="truncate"
                                        title={unit.accessType}
                                      >
                                        {unit.accessType}
                                      </div>
                                    </TableCell>
                                    <TableCell className="w-1/3">
                                      <div className="flex space-x-2">
                                        <Link
                                          href={`/dashboard/units/${unit.id}`}
                                        >
                                          <Button variant="default">
                                            View Unit
                                          </Button>
                                        </Link>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={3}
                                    className="text-center"
                                  >
                                    No units available for this session.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {activities.map((activity) => (
                  <li key={activity.id} className="flex items-start space-x-2">
                    {activity.type === "rubric" ? (
                      <FileText className="w-5 h-5 mt-1 text-blue-500" />
                    ) : (
                      <Book className="w-5 h-5 mt-1 text-green-500" />
                    )}
                    <div>
                      <Link
                        href={
                          activity.type === "rubric"
                            ? `/dashboard/rubrics/${activity.id}`
                            : `/dashboard/units/${activity.unitId}/assignments/${activity.id}`
                        }
                        className="font-medium hover:underline"
                      >
                        {activity.name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        <Clock className="inline w-4 h-4 mr-1" />
                        {new Date(
                          activity.latestDate
                        ).toLocaleDateString()} - {activity.reason}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
