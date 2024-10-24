"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import createApiClient from "~/lib/api-client";
import { useSession } from "next-auth/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  AlertCircle,
  Loader2,
  Download,
  FileQuestion,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Criterion = {
  name: string;
  marks: number;
  descriptors: Record<string, string>;
};

type Rubric = {
  id: string;
  title: string;
  status: string;
  rubricData: {
    criteria: Criterion[];
  } | null;
};

export default function ViewRubricPage({
  params,
}: Readonly<{
  params: { rubricId: string };
}>) {
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchRubric = async () => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    try {
      const response = await apiClient.get(`rubrics/${params.rubricId}`);
      setRubric(response.data.data);
      if (response.data.data.status === "PENDING") {
        setTimeout(fetchRubric, 30000); // Poll every 30 seconds if status is PENDING
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch rubric:", error);
      setError("Failed to load rubric. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRubric();
  }, [params.rubricId, session]);

  const handleExport = async (format: "pdf" | "xls") => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    try {
      const response = await apiClient.get(
        `rubrics/${params.rubricId}/export/${format}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rubric-${params.rubricId}.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(`Failed to export ${format.toUpperCase()}:`, error);
      setError(`Failed to export ${format.toUpperCase()}. Please try again.`);
    }
  };

  const handleCriterionChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    if (!rubric || !rubric.rubricData) return;

    const updatedCriteria = [...rubric.rubricData.criteria];
    if (field === "name" || field === "marks") {
      updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    } else {
      updatedCriteria[index] = {
        ...updatedCriteria[index],
        descriptors: {
          ...updatedCriteria[index].descriptors,
          [field]: value as string,
        },
      };
    }
    setRubric({
      ...rubric,
      rubricData: { ...rubric.rubricData, criteria: updatedCriteria },
    });
  };

  const handleAddCriterion = () => {
    if (!rubric || !rubric.rubricData) return;

    const newCriterion: Criterion = {
      name: "New Criterion",
      marks: 0,
      descriptors: { F: "", P: "", C: "", D: "", HD: "" },
    };

    setRubric({
      ...rubric,
      rubricData: {
        ...rubric.rubricData,
        criteria: [...rubric.rubricData.criteria, newCriterion],
      },
    });
  };

  const handleRemoveCriterion = (index: number) => {
    if (!rubric || !rubric.rubricData) return;

    const updatedCriteria = rubric.rubricData.criteria.filter(
      (_, i) => i !== index
    );
    setRubric({
      ...rubric,
      rubricData: { ...rubric.rubricData, criteria: updatedCriteria },
    });
  };

  const handleSave = async () => {
    if (!session?.user?.accessToken || !rubric || !rubric.rubricData) return;

    setSaving(true);
    const apiClient = createApiClient(session.user.accessToken);
    try {
      const payload = {
        rubricData: {
          title: rubric.title,
          criteria: rubric.rubricData.criteria,
        },
        title: rubric.title,
      };
      await apiClient.put(`rubrics/${params.rubricId}`, payload);
      // Show success message or update UI as needed
    } catch (error) {
      console.error("Failed to save rubric:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
          <p className="text-lg font-semibold">Loading Rubric...</p>
          <p className="text-sm text-muted-foreground">
            Please wait while we fetch the rubric data.
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Rubric</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchRubric}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      );
    }

    if (!rubric) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">Rubric Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The requested rubric could not be found or may have been deleted.
          </p>
          <Button onClick={() => router.push("/dashboard/rubrics")}>
            View All Rubrics
          </Button>
        </div>
      );
    }

    if (rubric.status === "PENDING") {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
          <h2 className="text-lg font-semibold mb-2">Generating Rubric...</h2>
          <p className="text-sm text-muted-foreground">
            This may take a few moments. We'll refresh automatically when it's
            ready.
          </p>
        </div>
      );
    }

    if (!rubric.rubricData) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No Rubric Data</h2>
          <p className="text-sm text-muted-foreground mb-4">
            This rubric doesn't have any data yet. It may still be processing or
            there might have been an error during generation.
          </p>
          <Button onClick={fetchRubric}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Again
          </Button>
        </div>
      );
    }

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Criterion</TableHead>
              <TableHead>F</TableHead>
              <TableHead>P</TableHead>
              <TableHead>C</TableHead>
              <TableHead>D</TableHead>
              <TableHead>HD</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rubric.rubricData.criteria.map((criterion, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Textarea
                    value={criterion.name}
                    onChange={(e) =>
                      handleCriterionChange(index, "name", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    value={criterion.descriptors.F}
                    onChange={(e) =>
                      handleCriterionChange(index, "F", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    value={criterion.descriptors.P}
                    onChange={(e) =>
                      handleCriterionChange(index, "P", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    value={criterion.descriptors.C}
                    onChange={(e) =>
                      handleCriterionChange(index, "C", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    value={criterion.descriptors.D}
                    onChange={(e) =>
                      handleCriterionChange(index, "D", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    value={criterion.descriptors.HD}
                    onChange={(e) =>
                      handleCriterionChange(index, "HD", e.target.value)
                    }
                    className="min-h-[100px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={criterion.marks}
                    onChange={(e) =>
                      handleCriterionChange(
                        index,
                        "marks",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCriterion(index)}
                    disabled={rubric?.rubricData?.criteria.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between">
          <Button onClick={handleAddCriterion}>
            <Plus className="mr-2 h-4 w-4" />
            Add Criterion
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/rubrics">Rubrics</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{rubric?.title || "Loading..."}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{rubric?.title ?? "Loading Rubric..."}</CardTitle>
            <CardDescription>
              {rubric?.status === "PENDING"
                ? "Generating rubric..."
                : "View and edit rubric details"}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => router.push("/dashboard/rubrics")}
              variant="outline"
            >
              Back
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={!rubric || rubric.status === "PENDING"}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleExport("pdf")}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleExport("xls")}>
                  Export as XLS
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
