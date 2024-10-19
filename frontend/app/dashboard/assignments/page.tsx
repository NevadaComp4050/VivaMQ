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
import { SearchIcon } from "lucide-react";
import Link from "next/link";

interface Assignment {
  id: string;
  name: string;
  unitId: string;
  dueDate: string;
  submissions: number;
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
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken) return;

      const apiClient = createApiClient(session.user.accessToken);

      try {
        const unitsResponse = await apiClient.get("/units");
        const unitsData = unitsResponse.data;
        setUnits(unitsData);

        const assignmentsPromises = unitsData.map((unit: Unit) =>
          apiClient.get(`/units/${unit.id}/assignments`).then((res) => res.data)
        );
        const allAssignments = await Promise.all(assignmentsPromises);
        setAssignments(allAssignments.flat());
      } catch (error) {
        console.error("Error fetching data:", error);
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
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
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>{assignment.submissions}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}