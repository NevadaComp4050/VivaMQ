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
import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "~/components/ui/use-toast";
import { Tutor } from "~/lib/mockDatabase";

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [newTutorName, setNewTutorName] = useState("");
  const [newTutorEmail, setNewTutorEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await fetch('/api/tutors');
      if (response.ok) {
        const data = await response.json();
        setTutors(data);
      } else {
        throw new Error('Failed to fetch tutors');
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tutors. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddTutor = async () => {
    if (newTutorName && newTutorEmail) {
      try {
        const response = await fetch('/api/tutors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newTutorName, email: newTutorEmail }),
        });
        if (response.ok) {
          const newTutor = await response.json();
          setTutors([...tutors, newTutor]);
          setNewTutorName("");
          setNewTutorEmail("");
          toast({
            title: "Success",
            description: "New tutor added successfully.",
          });
        } else {
          throw new Error('Failed to add tutor');
        }
      } catch (error) {
        console.error('Error adding tutor:', error);
        toast({
          title: "Error",
          description: "Failed to add tutor. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const filteredTutors = tutors.filter(
    (tutor :Tutor) =>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTutors.map((tutor) => (
                <TableRow key={tutor.id}>
                  <TableCell>{tutor.name}</TableCell>
                  <TableCell>{tutor.email}</TableCell>
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