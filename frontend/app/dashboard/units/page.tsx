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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";

// Define the Unit type
type Unit = {
  id: string;
  name: string;
  sessionId: string;
  ownerId: string;
  accessType: string;
};

// Define the Session type
type Session = {
  id: string;
  displayName: string;
  year: number;
  term: string;
  units: Unit[];
};

async function getUnits(): Promise<Session[]> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    throw new Error('Not authenticated');
  }

  try {
    const { data } = await api.get("/units/by-session");

    console.log(data.data);

    return data.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw new Error('Failed to fetch units');
  }
}

export default async function UnitsPage() {
  let sessions: Session[] = [];
  let error: string | null = null;

  try {
    sessions = await getUnits();
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
            <Accordion type="single" collapsible className="w-full">
              {sessions.length && sessions.map((session) => (
                <AccordionItem key={session.id} value={session.id}>
                  <AccordionTrigger>{session.displayName}</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit Name</TableHead>
                          <TableHead>Access Type</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {session.units && session.units.length > 0 ? (
                          session.units.map((unit: Unit) => (
                            <TableRow key={unit.id}>
                              <TableCell>{unit.name}</TableCell>
                              <TableCell>{unit.accessType}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Link href={`/dashboard/units/${unit.id}`}>
                                    <Button variant="default">View Unit</Button>
                                  </Link>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No units available for this session.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}