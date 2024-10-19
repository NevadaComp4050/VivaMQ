"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { PlusIcon } from "lucide-react";
import { useToast } from "~/components/ui/use-toast";
import createApiClient from '~/lib/api-client';

export default function UnitForm() {
  const [newUnit, setNewUnit] = useState({
    name: "",
    year: new Date().getFullYear(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", year: "" });
  
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", year: "" };

    if (!newUnit.name.trim()) {
      newErrors.name = "Unit name is required";
      isValid = false;
    }

    if (!newUnit.year) {
      newErrors.year = "Year is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateUnit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const apiClient = createApiClient(session?.user?.accessToken);
        await apiClient.post("/units", newUnit);
        setNewUnit({ name: "", year: new Date().getFullYear() });
        setErrors({ name: "", year: "" });

        toast({
          title: "Success",
          description: "Unit created successfully.",
          duration: 3000,
        });

        router.refresh();
      } catch (error) {
        console.error("Error creating unit:", error);
        toast({
          title: "Error",
          description: "Failed to create unit. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUnit((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setNewUnit((prev) => ({ ...prev, year: parsedValue }));
    setErrors((prev) => ({ ...prev, year: "" }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Unit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Input
              placeholder="Unit Name"
              name="name"
              value={newUnit.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <Select
              value={newUnit.year.toString()}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
          </div>
        </div>
        <Button 
          onClick={handleCreateUnit} 
          disabled={isLoading || !session}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : (
            <>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Unit
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}