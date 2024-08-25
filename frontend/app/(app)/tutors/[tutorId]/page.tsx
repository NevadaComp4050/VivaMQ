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

export default function EditTutorPage({
  params,
}: {
  params: { tutorId: string };
}) {
  const [tutor, setTutor] = useState({
    id: params.tutorId,
    name: "",
    email: "",
    phone: "",
  });

  const [units, setUnits] = useState([
    { id: 1, name: "Advanced Database Systems", assigned: true },
    { id: 2, name: "Software Engineering Principles", assigned: false },
    { id: 3, name: "Machine Learning Fundamentals", assigned: true },
  ]);

  useEffect(() => {
    // Fetch tutor data
    // This is a mock fetch, replace with actual API call
    const fetchTutor = async () => {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTutor({
        id: params.tutorId,
        name: "John Doe",
        email: "john.doe~example.com",
        phone: "123-456-7890",
      });
    };

    fetchTutor();
  }, [params.tutorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTutor((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnitAssignment = (unitId: number) => {
    setUnits(
      units.map((unit) =>
        unit.id === unitId ? { ...unit, assigned: !unit.assigned } : unit
      )
    );
  };

  const handleSave = () => {
    // Save tutor data
    console.log("Saving tutor:", tutor);
    console.log(
      "Assigned units:",
      units.filter((unit) => unit.assigned).map((unit) => unit.id)
    );
  };

  const handleDelete = () => {
    // Delete tutor
    console.log("Deleting tutor:", tutor.id);
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
