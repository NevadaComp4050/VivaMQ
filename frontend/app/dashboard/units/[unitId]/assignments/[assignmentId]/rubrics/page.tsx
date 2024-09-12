"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { PlusIcon, LinkIcon, ExternalLinkIcon } from "lucide-react";

interface Rubric {
  id: string;
  name: string;
  unit: string;
  year: string;
  session: string;
}

export default function AssignmentRubricPage({
  params,
}: {
  params: { unitId: string; assignmentId: string };
}) {
  const router = useRouter();
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [selectedRubricId, setSelectedRubricId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await fetch("/api/rubrics");
        if (!response.ok) {
          throw new Error("Failed to fetch rubrics");
        }
        const data = await response.json();
        setRubrics(data);
      } catch (err) {
        setError("Error fetching rubrics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRubrics();
  }, []);

  const handleLinkRubric = async () => {
    if (selectedRubricId) {
      try {
        const response = await fetch(
          `/api/assignments/${params.assignmentId}/link-rubric`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rubricId: selectedRubricId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to link rubric");
        }

        router.push(
          `/units/${params.unitId}/assignments/${params.assignmentId}`
        );
      } catch (err) {
        console.error("Error linking rubric:", err);
        setError("Failed to link rubric");
      }
    }
  };

  const filteredRubrics = rubrics.filter(
    (rubric) =>
      rubric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rubric.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Link Rubric to Assignment</h1>
        <Button asChild>
          <Link href="/rubrics/create">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New Rubric
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Rubric</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="search">Search Rubrics</Label>
                <Input
                  id="search"
                  placeholder="Search by name or unit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="rubric-select">Select Rubric</Label>
                <Select
                  onValueChange={setSelectedRubricId}
                  value={selectedRubricId || undefined}
                >
                  <SelectTrigger id="rubric-select">
                    <SelectValue placeholder="Select a rubric" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRubrics.map((rubric) => (
                      <SelectItem key={rubric.id} value={rubric.id}>
                        {rubric.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleLinkRubric} disabled={!selectedRubricId}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Link Rubric to Assignment
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Rubrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRubrics.map((rubric) => (
                <TableRow key={rubric.id}>
                  <TableCell>{rubric.name}</TableCell>
                  <TableCell>{rubric.unit}</TableCell>
                  <TableCell>{rubric.year}</TableCell>
                  <TableCell>{rubric.session}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/rubrics/${rubric.id}`}>
                        <ExternalLinkIcon className="mr-2 h-4 w-4" />
                        View
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
