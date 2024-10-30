"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { FileText, Book, Clock, ExternalLink, Loader2 } from "lucide-react";
import { parseISO, formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import createApiClient from "~/lib/api-client";

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

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken) return;

      const apiClient = createApiClient(session.user.accessToken);

      try {
        const [unitsResponse, dashboardResponse, activitiesResponse] =
          await Promise.all([
            apiClient.get("/units/by-session"),
            apiClient.get("/user/me"),
            apiClient.get("/activity"),
          ]);

        setSessions(unitsResponse.data.data);
        setName(dashboardResponse.data.name);
        setActivities(activitiesResponse.data.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const quickLinks = [
    { name: "Create New Unit", href: "/dashboard/units/create", icon: Book },
    {
      name: "Create New Rubric",
      href: "/dashboard/rubrics/create",
      icon: FileText,
    },
  ];

  const formatDateTime = (dateString: string): string => {
    const date = parseISO(dateString);
    return formatRelative(date, new Date());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold mb-6"
      >
        Welcome{name ? `, ${name}` : ""}!
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2"
        >
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
                  <AnimatePresence>
                    {sessions.map((session) => (
                      <motion.div
                        key={session.id}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AccordionItem value={session.id}>
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
                                  <TableHead className="w-1/3">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <AnimatePresence>
                                  {session.units && session.units.length > 0 ? (
                                    session.units.map((unit: Unit) => (
                                      <motion.tr
                                        key={unit.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
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
                                      </motion.tr>
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
                                </AnimatePresence>
                              </TableBody>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Accordion>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-blue-600 hover:underline"
                    >
                      <link.icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <AnimatePresence>
                  {activities.map((activity, index) => (
                    <motion.li
                      key={activity.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-2"
                    >
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
                          {formatDateTime(activity.latestDate)} -{" "}
                          {activity.reason}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
