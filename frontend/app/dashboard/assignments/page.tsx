"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import createApiClient from "~/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { SearchIcon, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

interface Assignment {
  id: string;
  name: string;
  specs: string;
  settings: string;
  unitId: string;
  deletedAt: string | null;
  description: string | null;
}

interface Unit {
  id: string;
  name: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Assignment;
    direction: "asc" | "desc";
  } | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken) return;

      const apiClient = createApiClient(session.user.accessToken);

      try {
        setLoading(true);
        const [assignmentsResponse, unitsResponse] = await Promise.all([
          apiClient.get("/assignments"),
          apiClient.get("/units"),
        ]);

        setAssignments(assignmentsResponse.data.data);
        setUnits(unitsResponse.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load assignments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] === null) return 0;
    if (b[key] === null) return 0;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredAssignments = sortedAssignments.filter(
    (assignment) =>
      assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedUnit === "" || assignment.unitId === selectedUnit)
  );

  const handleSort = (key: keyof Assignment) => {
    setSortConfig((prevConfig) => {
      if (prevConfig && prevConfig.key === key) {
        return {
          key,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: keyof Assignment) => {
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      );
    }
    return null;
  };

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
        All Assignments
      </motion.h1>

      <div
        className="mb-6"
      >
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Assignments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex space-x-2 mb-4"
          >
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedUnit}
              onValueChange={(value) => {
                setSelectedUnit(value === "All" ? "" : value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Units</SelectItem>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center h-32"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </motion.div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("name")}
                    className="cursor-pointer"
                  >
                    Assignment Name {getSortIcon("name")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("unitId")}
                    className="cursor-pointer"
                  >
                    Unit {getSortIcon("unitId")}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("settings")}
                    className="cursor-pointer"
                  >
                    Settings {getSortIcon("settings")}
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredAssignments.map((assignment) => (
                    <motion.tr
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>{assignment.name}</TableCell>
                      <TableCell>
                        {units.find((u) => u.id === assignment.unitId)?.name}
                      </TableCell>
                      <TableCell>{assignment.settings}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/dashboard/units/${assignment.unitId}/assignments/${assignment.id}`}
                          >
                            Manage
                          </Link>
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
