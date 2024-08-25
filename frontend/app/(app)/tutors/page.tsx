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
import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

export default function TutorsPage() {
  const [tutors, setTutors] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john~example.com",
      units: ["Advanced Database Systems", "Software Engineering"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane~example.com",
      units: ["Machine Learning", "Data Structures"],
    },
  ]);
  const [newTutorName, setNewTutorName] = useState("");
  const [newTutorEmail, setNewTutorEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddTutor = () => {
    if (newTutorName && newTutorEmail) {
      setTutors([
        ...tutors,
        {
          id: tutors.length + 1,
          name: newTutorName,
          email: newTutorEmail,
          units: [],
        },
      ]);
      setNewTutorName("");
      setNewTutorEmail("");
    }
  };

  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tutor Management</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Tutor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Tutor Name"
              value={newTutorName}
              onChange={(e) => setNewTutorName(e.target.value)}
            />
            <Input
              placeholder="Email"
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
          <CardTitle>Tutor List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tutors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell>{tutor.name}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
                  <TableCell>{tutor.units.join(", ")}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tutors/${tutor.id}`}>Edit</Link>
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
