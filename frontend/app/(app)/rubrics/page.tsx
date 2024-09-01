'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import Link from 'next/link'
import { PlusIcon, SearchIcon } from 'lucide-react'

interface Rubric {
  id: string
  name: string
  unit: string
  assignment: string
  year: string
  session: string
}

export default function RubricsPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedSession, setSelectedSession] = useState("all")

  useEffect(() => {
    const fetchRubrics = async () => {
      try {
        const response = await fetch('/api/rubrics')
        if (response.ok) {
          const data = await response.json()
          setRubrics(data)
        } else {
          console.error('Failed to fetch rubrics')
        }
      } catch (error) {
        console.error('Error fetching rubrics:', error)
      }
    }
    fetchRubrics()
  }, [])

  const filteredRubrics = rubrics.filter(rubric => 
    (rubric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rubric.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rubric.assignment.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedYear === "all" || rubric.year === selectedYear) &&
    (selectedSession === "all" || rubric.session === selectedSession)
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Rubrics</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rubric Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rubrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="S1">S1</SelectItem>
                <SelectItem value="S2">S2</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild>
              <Link href="/rubrics/create">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Rubric
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rubric Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRubrics.map((rubric) => (
                <TableRow key={rubric.id}>
                  <TableCell>{rubric.name}</TableCell>
                  <TableCell>{rubric.unit}</TableCell>
                  <TableCell>{rubric.assignment}</TableCell>
                  <TableCell>{rubric.year}</TableCell>
                  <TableCell>{rubric.session}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/rubrics/${rubric.id}`}>
                        Manage
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}