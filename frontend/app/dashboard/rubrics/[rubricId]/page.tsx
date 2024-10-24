"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { AlertCircle, Loader2, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
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
  rubricData: {
    criteria: Criterion[];
  };
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

  useEffect(() => {
    const fetchRubric = async () => {
      if (!session?.user?.accessToken) return;

      const apiClient = createApiClient(session.user.accessToken);
      try {
        const response = await apiClient.get(`rubrics/${params.rubricId}`);
        setRubric(response.data.data);
      } catch (error) {
        console.error("Failed to fetch rubric:", error);
        setError("Failed to load rubric. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

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

  const handleMarksChange = (index: number, value: number) => {
    if (!rubric) return;

    const updatedCriteria = [...rubric.rubricData.criteria];
    updatedCriteria[index] = { ...updatedCriteria[index], marks: value };
    setRubric({
      ...rubric,
      rubricData: { ...rubric.rubricData, criteria: updatedCriteria },
    });
  };

  const handleSave = async () => {
    if (!session?.user?.accessToken || !rubric) return;

    setSaving(true);
    const apiClient = createApiClient(session.user.accessToken);
    try {
      await apiClient.put(`rubrics/${params.rubricId}`, rubric);
      // Show success message or update UI as needed
    } catch (error) {
      console.error("Failed to save rubric:", error);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (!rubric)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Rubric not found</AlertDescription>
      </Alert>
    );

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
            <BreadcrumbPage>{rubric.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{rubric.title}</CardTitle>
          <div className="flex space-x-2">
            <Button onClick={() => router.back()} variant="outline">
              Back
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleExport("pdf")} disabled>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleExport("xls")}>
                  Export as XLS
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {rubric.rubricData.criteria.map((criterion, index) => (
                <TableRow key={index}>
                  <TableCell>{criterion.name}</TableCell>
                  <TableCell>{criterion.descriptors.F}</TableCell>
                  <TableCell>{criterion.descriptors.P}</TableCell>
                  <TableCell>{criterion.descriptors.C}</TableCell>
                  <TableCell>{criterion.descriptors.D}</TableCell>
                  <TableCell>{criterion.descriptors.HD}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={criterion.marks}
                      onChange={(e) =>
                        handleMarksChange(index, parseInt(e.target.value))
                      }
                      className="w-16"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
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
        </CardContent>
      </Card>
    </div>
  );
}
