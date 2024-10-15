"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PlusIcon, Loader2 } from "lucide-react";
import { toast } from "~/components/ui/use-toast";

interface Unit {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  name: string;
}

interface Criterion {
  id: number;
  name: string;
  descriptors: Record<string, string>;
}

export default function CreateRubricPage() {
  const router = useRouter();

  // general data types
  const [rubricTitle, setRubricTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [assignment, setAssignment] = useState("");
  const [year, setYear] = useState("");
  const [session, setSession] = useState("");

  // criteria for AI
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 1, name: "", descriptors: {} },
  ]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [sessions, setSessions] = useState<string[]>(["S1", "S2"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newAssignmentName, setNewAssignmentName] = useState("");
  const [newYear, setNewYear] = useState("");

  const gradeDescriptors = ["F", "P", "C", "D", "HD"];

  useEffect(() => {
    fetchUnits();
    fetchYears();
  }, []);

  useEffect(() => {
    if (unit) {
      fetchAssignments(unit);
    } else {
      setAssignments([]);
    }
  }, [unit]);

  const fetchUnits = async () => {
    try {
      const response = await fetch("/api/units");
      if (response.ok) {
        const data = await response.json();
        setUnits(data);
      } else {
        throw new Error("Failed to fetch units");
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      toast({
        title: "Error",
        description: "Failed to fetch units. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchAssignments = async (unitId: string) => {
    try {
      const response = await fetch(`/api/units/${unitId}/assignments`);
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        throw new Error("Failed to fetch assignments");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch assignments. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchYears = async () => {
    try {
      const response = await fetch("/api/years");
      if (response.ok) {
        const data = await response.json();
        setYears(data);
      } else {
        throw new Error("Failed to fetch years");
      }
    } catch (error) {
      console.error("Error fetching years:", error);
      toast({
        title: "Error",
        description: "Failed to fetch years. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddCriterion = () => {
    setCriteria([
      ...criteria,
      { id: criteria.length + 1, name: "", descriptors: {} },
    ]);
  };

  const handleCriterionChange = (id: number, field: "name", value: string) => {
    setCriteria(
      criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleDescriptorChange = (
    criterionId: number,
    grade: string,
    value: string
  ) => {
    setCriteria(
      criteria.map((c) =>
        c.id === criterionId
          ? { ...c, descriptors: { ...c.descriptors, [grade]: value } }
          : c
      )
    );
  };

  const handleCreateRubric = async () => {
    const newRubric = {
      name: rubricTitle,
      unit,
      assignment,
      year,
      session,
      criteria,
    };
    try {
      const response = await fetch("/api/rubrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRubric),
      });
      if (response.ok) {
        router.push("/rubrics");
      } else {
        throw new Error("Failed to create rubric");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create rubric. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateRubric = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-rubric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          criteria: criteria.map((c) => ({ name: c.name })),
        }),
      });
      if (response.ok) {
        const generatedCriteria = await response.json();
        setCriteria(generatedCriteria);
      } else {
        throw new Error("Failed to generate rubric");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate rubric. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateUnit = async () => {
    try {
      const response = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUnitName }),
      });
      if (response.ok) {
        const newUnit = await response.json();
        setUnits([...units, newUnit]);
        setUnit(newUnit.id);
        setNewUnitName("");
        toast({
          title: "Success",
          description: "New unit created successfully.",
        });
      } else {
        throw new Error("Failed to create unit");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create unit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateAssignment = async () => {
    if (!unit) {
      toast({
        title: "Error",
        description: "Please select a unit first.",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch(`/api/units/${unit}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAssignmentName }),
      });
      if (response.ok) {
        const newAssignment = await response.json();
        setAssignments([...assignments, newAssignment]);
        setAssignment(newAssignment.id);
        setNewAssignmentName("");
        toast({
          title: "Success",
          description: "New assignment created successfully.",
        });
      } else {
        throw new Error("Failed to create assignment");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateYear = async () => {
    try {
      const response = await fetch("/api/years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: newYear }),
      });
      if (response.ok) {
        setYears([...years, newYear]);
        setYear(newYear);
        setNewYear("");
        toast({
          title: "Success",
          description: "New year added successfully.",
        });
      } else {
        throw new Error("Failed to add year");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add year. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Rubric</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rubric Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rubricTitle">Rubric Title</Label>
              <Input
                id="rubricTitle"
                value={rubricTitle}
                onChange={(e) => setRubricTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <div className="flex space-x-2">
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Unit</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Unit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Unit Name"
                        value={newUnitName}
                        onChange={(e) => setNewUnitName(e.target.value)}
                      />
                      <Button onClick={handleCreateUnit}>Create Unit</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment">Assignment</Label>
              <div className="flex space-x-2">
                <Select value={assignment} onValueChange={setAssignment}>
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Select Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Assignment</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Assignment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Assignment Name"
                        value={newAssignmentName}
                        onChange={(e) => setNewAssignmentName(e.target.value)}
                      />
                      <Button onClick={handleCreateAssignment}>
                        Create Assignment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <div className="flex space-x-2">
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Add Year</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Year</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Year"
                          value={newYear}
                          onChange={(e) => setNewYear(e.target.value)}
                        />
                        <Button onClick={handleCreateYear}>Add Year</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session">Session</Label>
                <Select value={session} onValueChange={setSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Session" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Criteria</Label>
              {criteria.map((criterion) => (
                <div key={criterion.id} className="flex space-x-2">
                  <Input
                    placeholder="Criterion name"
                    value={criterion.name}
                    onChange={(e) =>
                      handleCriterionChange(
                        criterion.id,
                        "name",
                        e.target.value
                      )
                    }
                  />
                  <Button type="button" onClick={handleAddCriterion}>
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Criterion
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleGenerateRubric}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Rubric"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Rubric</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterion</TableHead>
                {gradeDescriptors.map((grade) => (
                  <TableHead key={grade}>{grade}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((criterion) => (
                <TableRow key={criterion.id}>
                  <TableCell>{criterion.name}</TableCell>
                  {gradeDescriptors.map((grade) => (
                    <TableCell key={grade}>
                      <Textarea
                        value={criterion.descriptors[grade] || ""}
                        onChange={(e) =>
                          handleDescriptorChange(
                            criterion.id,
                            grade,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button onClick={handleCreateRubric}>Create Rubric</Button>
      </div>
    </div>
  );
}
