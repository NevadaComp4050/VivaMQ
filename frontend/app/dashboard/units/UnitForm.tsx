"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { PlusIcon } from "lucide-react";
import api from '~/lib/api';

export default function UnitForm() {
  const [newUnit, setNewUnit] = useState({
    name: "",
    year: new Date().getFullYear(),
  });
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateUnit = async () => {
    if (newUnit.name && newUnit.year) {
      try {
        await api.post("/units", newUnit); 
        setNewUnit({ name: "", year: new Date().getFullYear() });

        setSuccessMessage("Unit created successfully.");
        router.refresh();

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (error) {
        console.error("Error creating unit:", error);
        alert('Error creating unit');
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUnit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    const parsedValue = parseInt(value, 10);
    setNewUnit((prev) => ({ ...prev, [name]: parsedValue }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Unit</CardTitle>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <div className="mb-4 text-green-500">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Unit Name"
            name="name"
            value={newUnit.name}
            onChange={handleInputChange}
          />
          <Select
            value={newUnit.year.toString()}
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
        </div>
        <Button onClick={handleCreateUnit}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Unit
        </Button>
      </CardContent>
    </Card>
  );
}
