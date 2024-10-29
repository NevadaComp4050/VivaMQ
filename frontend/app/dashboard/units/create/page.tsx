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

enum Term {
  SESSION_1 = "SESSION_1",
  SESSION_2 = "SESSION_2",
  SESSION_3 = "SESSION_3",
  ALL_YEAR = "ALL_YEAR"
}

export default function UnitCreationPage() {
  const [newUnit, setNewUnit] = useState({
    name: "",
    year: new Date().getFullYear(),
    term: "" as Term | "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", year: "", term: "" });
  
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", year: "", term: "" };

    if (!newUnit.name.trim()) {
      newErrors.name = "Unit name is required";
      isValid = false;
    }

    if (!newUnit.year) {
      newErrors.year = "Year is required";
      isValid = false;
    }

    if (!newUnit.term) {
      newErrors.term = "Term is required";
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
        setNewUnit({ name: "", year: new Date().getFullYear(), term: "" });
        setErrors({ name: "", year: "", term: "" });

        toast({
          title: "Success",
          description: "Unit created successfully.",
          duration: 3000,
        });

        router.push('/dashboard'); // Redirect to units list page after successful creation
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

  const handleSelectChange = (name: "year" | "term", value: string) => {
    if (name === "year") {
      const parsedValue = parseInt(value, 10);
      setNewUnit((prev) => ({ ...prev, [name]: parsedValue }));
    } else {
      setNewUnit((prev) => ({ ...prev, [name]: value as Term }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Unit</h1>
      <Card>
        <CardHeader>
          <CardTitle>Unit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Unit Name</label>
              <Input
                id="name"
                placeholder="Enter unit name"
                name="name"
                value={newUnit.name}
                onChange={handleInputChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <Select
                value={newUnit.year.toString()}
                onValueChange={(value) => handleSelectChange("year", value)}
              >
                <SelectTrigger id="year" className={errors.year ? "border-red-500" : ""}>
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
            <div className="md:col-span-2">
              <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <Select
                value={newUnit.term}
                onValueChange={(value) => handleSelectChange("term", value)}
              >
                <SelectTrigger id="term" className={errors.term ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Term.SESSION_1}>Session 1</SelectItem>
                  <SelectItem value={Term.SESSION_2}>Session 2</SelectItem>
                  <SelectItem value={Term.SESSION_3}>Session 3</SelectItem>
                  <SelectItem value={Term.ALL_YEAR}>All Year</SelectItem>
                </SelectContent>
              </Select>
              {errors.term && <p className="text-red-500 text-sm mt-1">{errors.term}</p>}
            </div>
          </div>
          <Button 
            onClick={handleCreateUnit} 
            disabled={isLoading || !session}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
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
    </div>
  );
}