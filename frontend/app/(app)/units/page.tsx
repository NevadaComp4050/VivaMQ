"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";

export default function UnitManagement() {
  const [units, setUnits] = useState([
    { id: 1, name: "Advanced Database Systems", assignments: 2 },
    { id: 2, name: "Software Engineering Principles", assignments: 3 },
    { id: 3, name: "Machine Learning Fundamentals", assignments: 1 },
  ]);
  const [newUnitName, setNewUnitName] = useState("");

  const handleCreateUnit = () => {
    if (newUnitName.trim()) {
      setUnits([
        ...units,
        { id: units.length + 1, name: newUnitName, assignments: 0 },
      ]);
      setNewUnitName("");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Unit Management</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Unit Name"
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
            />
            <Button onClick={handleCreateUnit}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Unit
            </Button>
          </div>
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
                <TableHead>Assignments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{unit.assignments}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Assignments
                      </Button>
                      <Button variant="destructive" size="sm">
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
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
