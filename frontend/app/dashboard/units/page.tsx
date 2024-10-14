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
import { getServerApiClient } from '~/utils/serverAPI'; 
import UnitForm from './UnitForm';


export default async function UnitsPage() {
  let units = [];

  try {
    const apiClient = getServerApiClient();
    const response = await apiClient.get("/units");
    units = response.data.data;
  } catch (error) {
    console.error("Error fetching units:", error);
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
                units.map((unit: any) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
