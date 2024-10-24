import { useState, useEffect } from 'react';
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
    return data.data;
  } catch (error) {
    console.error("Error fetching units:", error);
    throw new Error('Failed to fetch units');
  }
}

export default function UnitsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const fetchedSessions = await getUnits();
        setSessions(fetchedSessions);
        if (fetchedSessions.length > 0) {
          setActiveAccordion([fetchedSessions[0].id]); // Expand the first accordion by default
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      }
    };

    fetchUnits();
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion((prevState) =>
      prevState.includes(id)
        ? prevState.filter((accordionId) => accordionId !== id) // Collapse if already open
        : [id] // Open the clicked one and close others
    );
  };

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
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={activeAccordion[0] || undefined}
              onValueChange={(value) => toggleAccordion(value)}
            >
              {sessions.length > 0 &&
                sessions.map((session) => (
                  <AccordionItem key={session.id} value={session.id}>
                    <AccordionTrigger onClick={() => toggleAccordion(session.id)}>
                      {session.displayName}
                    </AccordionTrigger>
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
