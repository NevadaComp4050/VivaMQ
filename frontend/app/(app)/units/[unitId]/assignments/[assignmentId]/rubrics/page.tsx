"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PlusIcon, FileIcon, DownloadIcon, UploadIcon } from "lucide-react";

export default function RubricManagementPage({
  params,
}: {
  params: { unitId: string; assignmentId: string };
}) {
  const [rubricTitle, setRubricTitle] = useState("");
  const [assessmentOverview, setAssessmentOverview] = useState("");
  const [criteria, setCriteria] = useState([{ id: 1, name: "", marks: 0 }]);
  const [selectedULOs, setSelectedULOs] = useState<string[]>([]);

  const gradeDescriptors = ["F", "P", "C", "D", "HD"];

  const ULOs = [
    { id: "ULO1", description: "Understand key concepts in the subject area" },
    {
      id: "ULO2",
      description: "Apply theoretical knowledge to practical scenarios",
    },
    { id: "ULO3", description: "Analyze and evaluate complex problems" },
    {
      id: "ULO4",
      description: "Communicate ideas effectively in written and oral forms",
    },
  ];

  const handleAddCriterion = () => {
    setCriteria([...criteria, { id: criteria.length + 1, name: "", marks: 0 }]);
  };

  const handleCriterionChange = (
    id: number,
    field: "name" | "marks",
    value: string | number
  ) => {
    setCriteria(
      criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleULOChange = (uloId: string) => {
    setSelectedULOs((prev) =>
      prev.includes(uloId)
        ? prev.filter((id) => id !== uloId)
        : [...prev, uloId]
    );
  };

  const handleGenerateRubric = () => {
    // Logic to generate rubric based on input
    console.log("Generating rubric...");
  };

  const handleExportPDF = () => {
    // Logic to export rubric as PDF
    console.log("Exporting rubric as PDF...");
  };

  const handleExportXLS = () => {
    // Logic to export rubric as XLS
    console.log("Exporting rubric as XLS...");
  };

  const handleUploadMarkingGuide = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Logic to handle marking guide upload
    console.log("Uploading marking guide...");
  };

  const handleConvertMarkingGuide = () => {
    // Logic to convert marking guide to rubric
    console.log("Converting marking guide to rubric...");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Rubric Management</h1>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">Create Rubric</TabsTrigger>
          <TabsTrigger value="convert">Convert Marking Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Rubric</CardTitle>
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
                  <Label htmlFor="assessmentOverview">
                    Assessment Overview
                  </Label>
                  <Textarea
                    id="assessmentOverview"
                    value={assessmentOverview}
                    onChange={(e) => setAssessmentOverview(e.target.value)}
                  />
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
                      <Input
                        type="number"
                        placeholder="Marks"
                        value={criterion.marks}
                        onChange={(e) =>
                          handleCriterionChange(
                            criterion.id,
                            "marks",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  ))}
                  <Button type="button" onClick={handleAddCriterion}>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Criterion
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Unit Learning Objectives (ULOs)</Label>
                  {ULOs.map((ulo) => (
                    <div key={ulo.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={ulo.id}
                        checked={selectedULOs.includes(ulo.id)}
                        onChange={() => handleULOChange(ulo.id)}
                      />
                      <label htmlFor={ulo.id}>{ulo.description}</label>
                    </div>
                  ))}
                </div>

                <Button type="button" onClick={handleGenerateRubric}>
                  Generate Rubric
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
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
                    <TableHead>Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteria.map((criterion) => (
                    <TableRow key={criterion.id}>
                      <TableCell>{criterion.name}</TableCell>
                      {gradeDescriptors.map((grade) => (
                        <TableCell key={grade}>
                          <Textarea placeholder={`${grade} descriptor`} />
                        </TableCell>
                      ))}
                      <TableCell>{criterion.marks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex space-x-2">
                <Button onClick={handleExportPDF}>
                  <FileIcon className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
                <Button onClick={handleExportXLS}>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export as XLS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="convert">
          <Card>
            <CardHeader>
              <CardTitle>Convert Marking Guide to Rubric</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="markingGuideUpload">
                    Upload Marking Guide (PDF)
                  </Label>
                  <Input
                    id="markingGuideUpload"
                    type="file"
                    accept=".pdf"
                    onChange={handleUploadMarkingGuide}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit Learning Objectives (ULOs)</Label>
                  {ULOs.map((ulo) => (
                    <div key={ulo.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`convert-${ulo.id}`}
                        checked={selectedULOs.includes(ulo.id)}
                        onChange={() => handleULOChange(ulo.id)}
                      />
                      <label htmlFor={`convert-${ulo.id}`}>
                        {ulo.description}
                      </label>
                    </div>
                  ))}
                </div>

                <Button type="button" onClick={handleConvertMarkingGuide}>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Convert to Rubric
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
