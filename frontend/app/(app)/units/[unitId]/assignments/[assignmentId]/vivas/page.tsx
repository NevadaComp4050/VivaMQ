"use client";

import { useState, useEffect } from "react";
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

export default function UnitVivasPage({
  params,
}: {
  params: { unitId: string; assignmentId: string };
}) {
  const [vivas, setVivas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchVivas = async () => {
      try {
        const response = await fetch(
          `/api/units/${params.unitId}/assignments/${params.assignmentId}/vivas`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vivas");
        }
        const data = await response.json();
        setVivas(data);
      } catch (err) {
        setError("Error fetching vivas data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVivas();
  }, [params.unitId, params.assignmentId]);

  const filteredVivas = vivas.filter(
    (viva) =>
      (viva.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        viva.assignment.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedAssignment === "" || viva.assignment === selectedAssignment) &&
      (selectedStatus === "" || viva.status === selectedStatus)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Vivas for Unit {params.unitId}, Assignment {params.assignmentId}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Vivas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vivas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={selectedAssignment}
              onValueChange={(value) => {
                setSelectedAssignment(value === "All" ? "" : value);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Assignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Assignments</SelectItem>
                <SelectItem value="Database Normalization">
                  Database Normalization
                </SelectItem>
                <SelectItem value="Query Optimization">
                  Query Optimization
                </SelectItem>
                <SelectItem value="Distributed Databases">
                  Distributed Databases
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value === "All" ? "" : value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVivas.map((viva) => (
                <TableRow key={viva.id}>
                  <TableCell>{viva.studentName}</TableCell>
                  <TableCell>{viva.assignment}</TableCell>
                  <TableCell>{viva.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/units/${params.unitId}/vivas/${viva.id}`}>
                        Manage Viva
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
