"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Loader2, Plus, Pencil, Trash } from "lucide-react";
import createApiClient from "~/lib/api-client";

type Rubric = {
  id: string;
  title: string;
  rubricData: {
    criteria: Array<{
      name: string;
      descriptors: {
        F: string;
        P: string;
        C: string;
        D: string;
        HD: string;
      };
      marks: number;
    }>;
  };
};

export default function RubricPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRubric, setNewRubric] = useState<Partial<Rubric>>({
    title: "",
    rubricData: { criteria: [] },
  });

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchRubrics();
  }, [session]);

  const fetchRubrics = async () => {
    if (!session?.user?.accessToken) return;

    const apiClient = createApiClient(session.user.accessToken);
    try {
      setIsLoading(true);

      const response = await apiClient.get("/rubrics");
      setRubrics(response.data.data);
    } catch (err) {
      setError("Failed to fetch rubrics");
    } finally {
      setIsLoading(false);
    }
  };

  const createRubric = async () => {
    if (!session?.user?.accessToken) return;
    const apiClient = createApiClient(session.user.accessToken);
    try {
      await apiClient.post("/rubrics", newRubric);
      setIsCreateDialogOpen(false);
      setNewRubric({ title: "", rubricData: { criteria: [] } });
      fetchRubrics();
    } catch (err) {
      setError("Failed to create rubric");
    }
  };

  const updateRubric = async () => {
    if (!session?.user?.accessToken || !selectedRubric) return;
    try {
      const apiClient = createApiClient(session.user.accessToken);
      await apiClient.put(`/rubrics/${selectedRubric.id}`, selectedRubric);
      setIsEditDialogOpen(false);
      fetchRubrics();
    } catch (err) {
      setError("Failed to update rubric");
    }
  };

  const deleteRubric = async (id: string) => {
    if (!session?.user?.accessToken) return;
    try {
      const apiClient = createApiClient(session.user.accessToken);
      await apiClient.delete(`/rubrics/${id}`);
      fetchRubrics();
    } catch (err) {
      setError("Failed to delete rubric");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Rubrics</CardTitle>
          <CardDescription>Manage your assessment rubrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create New Rubric
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Rubric</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new rubric.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newRubric.title}
                      onChange={(e) =>
                        setNewRubric({ ...newRubric, title: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rubricData" className="text-right">
                      Rubric Data
                    </Label>
                    <Textarea
                      id="rubricData"
                      value={JSON.stringify(newRubric.rubricData, null, 2)}
                      onChange={(e) =>
                        setNewRubric({
                          ...newRubric,
                          rubricData: JSON.parse(e.target.value),
                        })
                      }
                      className="col-span-3"
                      rows={10}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createRubric}>Create Rubric</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rubrics.map((rubric) => (
                <TableRow key={rubric.id}>
                  <TableCell>{rubric.title}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedRubric(rubric)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Rubric</DialogTitle>
                            <DialogDescription>
                              Make changes to the rubric.
                            </DialogDescription>
                          </DialogHeader>
                          {selectedRubric && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-title"
                                  className="text-right"
                                >
                                  Title
                                </Label>
                                <Input
                                  id="edit-title"
                                  value={selectedRubric.title}
                                  onChange={(e) =>
                                    setSelectedRubric({
                                      ...selectedRubric,
                                      title: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-rubricData"
                                  className="text-right"
                                >
                                  Rubric Data
                                </Label>
                                <Textarea
                                  id="edit-rubricData"
                                  value={JSON.stringify(
                                    selectedRubric.rubricData,
                                    null,
                                    2
                                  )}
                                  onChange={(e) =>
                                    setSelectedRubric({
                                      ...selectedRubric,
                                      rubricData: JSON.parse(e.target.value),
                                    })
                                  }
                                  className="col-span-3"
                                  rows={10}
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={updateRubric}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => deleteRubric(rubric.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
