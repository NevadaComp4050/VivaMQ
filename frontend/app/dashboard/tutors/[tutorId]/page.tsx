"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { SaveIcon, TrashIcon } from "lucide-react";
import { toast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Unit {
  id: string;
  name: string;
  assigned: boolean;
}

export default function EditTutorPage({
  params,
}: {
  params: { tutorId: string };
}) {
  const router = useRouter();
  const [tutor, setTutor] = useState<Tutor>({
    id: params.tutorId,
    name: "",
    email: "",
    phone: "",
  });

  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    fetchTutor();
    fetchUnits();
  }, [params.tutorId]);

  const fetchTutor = async () => {
    try {
      const response = await fetch(`/backend/tutors/${params.tutorId}`);
      if (response.ok) {
        const data: Tutor = await response.json();
        setTutor(data);
      } else {
        throw new Error('Failed to fetch tutor');
      }
    } catch (error) {
      console.error('Error fetching tutor:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tutor details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch('/backend/units');
      if (response.ok) {
        const data: Unit[] = await response.json();
        setUnits(data.map(unit => ({ ...unit, assigned: false }))); // Ensure all units have the 'assigned' property
      } else {
        throw new Error('Failed to fetch units');
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      toast({
        title: "Error",
        description: "Failed to fetch units. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTutor((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnitAssignment = (unitId: string) => {
    setUnits(prevUnits =>
      prevUnits.map(unit =>
        unit.id === unitId ? { ...unit, assigned: !unit.assigned } : unit
      )
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/backend/tutors/${tutor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tutor,
          assignedUnits: units.filter(unit => unit.assigned).map(unit => unit.id)
        }),
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Tutor details updated successfully.",
        });
      } else {
        throw new Error('Failed to update tutor');
      }
    } catch (error) {
      console.error('Error updating tutor:', error);
      toast({
        title: "Error",
        description: "Failed to update tutor details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/backend/tutors/${tutor.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Tutor deleted successfully.",
        });
        router.push('/tutors');
      } else {
        throw new Error('Failed to delete tutor');
      }
    } catch (error) {
      console.error('Error deleting tutor:', error);
      toast({
        title: "Error",
        description: "Failed to delete tutor. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Tutor: {tutor.name}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tutor Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={tutor.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={tutor.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={tutor.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Unit Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Name</TableHead>
                <TableHead>Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={unit.assigned}
                      onCheckedChange={() => handleUnitAssignment(unit.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="destructive" onClick={handleDelete}>
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete Tutor
        </Button>
        <Button onClick={handleSave}>
          <SaveIcon className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}