"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import createApiClient from '~/lib/api-client';
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
import { SearchIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

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
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken) return;

      const apiClient = createApiClient(session.user.accessToken);

      try {
        setLoading(true);
        const [assignmentsResponse, unitsResponse] = await Promise.all([
          apiClient.get("/assignments"),
          apiClient.get("/units")
        ]);

        setAssignments(assignmentsResponse.data.data);

        console.log(unitsResponse.data.data);
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

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedUnit === "" || assignment.unitId === selectedUnit)
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Assignments</h1>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex space-x-2 mb-4">
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
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Settings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}