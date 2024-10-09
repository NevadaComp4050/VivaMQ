"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

interface Unit {
  id: string;
  name: string;
  code: string;
  year: string;
  session: string;
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [newUnit, setNewUnit] = useState({
    name: "",
    code: "",
    year: "",
    session: "",
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch("/api/units");
      if (!response.ok) {
        throw new Error("Failed to fetch units");
      }
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const handleCreateUnit = async () => {
    if (newUnit.name.trim() && newUnit.code.trim() && newUnit.year && newUnit.session) {
      try {
        const response = await fetch("/api/units", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUnit),
        });

        if (!response.ok) {
          throw new Error("Failed to create unit");
        }

        const createdUnit = await response.json();
        setUnits([...units, createdUnit]);
        setNewUnit({ name: "", code: "", year: "", session: "" });
      } catch (error) {
        console.error("Error creating unit:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUnit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewUnit((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Unit Management</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Unit Name"
              name="name"
              value={newUnit.name}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Unit Code"
              name="code"
              value={newUnit.code}
              onChange={handleInputChange}
            />
            <Select
              value={newUnit.year}
              onValueChange={(value) => handleSelectChange("year", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newUnit.session}
              onValueChange={(value) => handleSelectChange("session", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Session 1">Session 1</SelectItem>
                <SelectItem value="Session 2">Session 2</SelectItem>
                <SelectItem value="Session 3">Session 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreateUnit}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Unit
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Units</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Name</TableHead>
                <TableHead>Unit Code</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.code}</TableCell>
                  <TableCell>{unit.year}</TableCell>
                  <TableCell>{unit.session}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/units/${unit.id}/assignments`}>
                          Assignments
                        </Link>
                      </Button>
                    </div>
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