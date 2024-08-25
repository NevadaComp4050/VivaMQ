import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function UnitPage({ params }: { params: { unitId: string } }) {
  // In a real application, you would fetch the unit details based on the unitId
  const unit = {
    id: params.unitId,
    name: "Advanced Database Systems",
    description:
      "This unit covers advanced topics in database systems including normalization, query optimization, and distributed databases.",
    assignments: 3,
    tutors: 2,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Unit: {unit.name}</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Unit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{unit.description}</p>
          <div className="flex space-x-4">
            <div>
              <strong>Assignments:</strong> {unit.assignments}
            </div>
            <div>
              <strong>Tutors:</strong> {unit.tutors}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4">
        <Button asChild>
          <Link href={`/units/${unit.id}/assignments`}>Manage Assignments</Link>
        </Button>
        <Button asChild>
          <Link href={`/units/${unit.id}/tutors`}>Manage Tutors</Link>
        </Button>
      </div>
    </div>
  );
}
