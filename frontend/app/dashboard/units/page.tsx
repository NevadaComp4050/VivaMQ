import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Link from "next/link";
import UnitForm from './UnitForm';
import api from '~/lib/api';
import { auth } from "~/auth";

// Define the Unit type
type Unit = {
  id: string;
  name: string;
  year: number;
  convenor: string;
};

async function getUnits(): Promise<Unit[]> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error('Not authenticated');
  }

  try {
    const { data } = await api.get("/units");
    return data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw new Error('Failed to fetch units');
  }
}

export default async function UnitsPage() {
  let units: Unit[] = [];
  let error: string | null = null;

  try {
    units = await getUnits();
  } catch (e) {
    error = e instanceof Error ? e.message : 'An unknown error occurred';
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Unit Management</h1>

      <UnitForm />
      <Card>
        <CardHeader>
          <CardTitle>Existing Units</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit Name</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Convenor</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {units.length > 0 ? (
                  units.map((unit: Unit) => (
                    <TableRow key={unit.id}>
                      <TableCell>{unit.name}</TableCell>
                      <TableCell>{unit.year}</TableCell>
                      <TableCell>{unit.convenor}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/dashboard/units/${unit.id}/assignments`}>
                            <button className="btn">Assignments</button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No units available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}