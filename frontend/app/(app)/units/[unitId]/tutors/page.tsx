"use client";

import { useState } from "react";
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

export default function UnitTutorsPage({
  params,
}: {
  params: { unitId: string };
}) {
  const [tutors, setTutors] = useState([
    { id: 1, name: "John Doe", email: "john~example.com" },
    { id: 2, name: "Jane Smith", email: "jane~example.com" },
  ]);
  const [newTutorEmail, setNewTutorEmail] = useState("");

  const handleAddTutor = () => {
    if (newTutorEmail.trim()) {
      setTutors([
        ...tutors,
        { id: tutors.length + 1, name: "New Tutor", email: newTutorEmail },
      ]);
      setNewTutorEmail("");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Tutors for Unit {params.unitId}
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Tutor to Unit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Tutor Email"
              type="email"
              value={newTutorEmail}
              onChange={(e) => setNewTutorEmail(e.target.value)}
            />
            <Button onClick={handleAddTutor}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Tutor
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unit Tutors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell>{tutor.name}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm">
                      Remove
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
