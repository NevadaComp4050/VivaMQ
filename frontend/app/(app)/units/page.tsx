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
import { PlusIcon } from "lucide-react";
import Link from "next/link";

interface Unit {
  id: string;
  name: string;
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [newUnitName, setNewUnitName] = useState("");

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await fetch('/api/units');
      if (!response.ok) {
        throw new Error('Failed to fetch units');
      }
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleCreateUnit = async () => {
    if (newUnitName.trim()) {
      try {
        const response = await fetch('/api/units', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newUnitName }),
        });

        if (!response.ok) {
          throw new Error('Failed to create unit');
        }

        const newUnit = await response.json();
        setUnits([...units, newUnit]);
        setNewUnitName("");
      } catch (error) {
        console.error('Error creating unit:', error);
      }
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/units/${unit.id}`}>Manage</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/units/${unit.id}/assignments`}>
                          Assignments
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/units/${unit.id}/tutors`}>Tutors</Link>
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