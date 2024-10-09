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

export default function UnitTutorsPage({
  params,
}: {
  params: { unitId: string };
}) {
  const [tutors, setTutors] = useState<any[]>([]);
  const [newTutorEmail, setNewTutorEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch(`/api/units/${params.unitId}/tutors`);
        if (!response.ok) {
          throw new Error('Failed to fetch tutors');
        }
        const data = await response.json();
        setTutors(data);
      } catch (err) {
        setError('Error fetching tutors data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [params.unitId]);

  const handleAddTutor = async () => {
    if (newTutorEmail.trim()) {
      try {
        const response = await fetch(`/api/units/${params.unitId}/tutors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: newTutorEmail }),
        });

        if (!response.ok) {
          throw new Error('Failed to add tutor');
        }

        const newTutor = await response.json();
        setTutors([...tutors, newTutor]);
        setNewTutorEmail("");
      } catch (err) {
        console.error('Error adding tutor:', err);
        setError('Failed to add tutor');
      }
    }
  };

  const handleRemoveTutor = async (tutorId: string) => {
    try {
      const response = await fetch(`/api/units/${params.unitId}/tutors/${tutorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove tutor');
      }

      setTutors(tutors.filter(tutor => tutor.id !== tutorId));
    } catch (err) {
      console.error('Error removing tutor:', err);
      setError('Failed to remove tutor');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


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
