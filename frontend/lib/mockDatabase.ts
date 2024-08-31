// lib/mockDatabase.ts

export interface Unit {
  id: string;
  name: string;
}

export interface Assignment {
  id: string;
  unitId: string;
  name: string;
  dueDate?: string;
  submissions?: number;
}

export interface Rubric {
  id: string;
  name: string;
  unit: string;
  assignment: string;
  year: string;
  session: string;
  criteria: Criterion[];
}

export interface Criterion {
  id: number;
  name: string;
  marks: number;
  descriptors: Record<string, string>;
}

export interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const mockDatabase = {
  units: [
    { id: "1", name: "Introduction to Programming" },
    { id: "2", name: "Web Development" },
  ] as Unit[],

  assignments: [
    { id: "1", unitId: "1", name: "Programming Basics Quiz" },
    { id: "2", unitId: "1", name: "Simple Calculator Project" },
    { id: "3", unitId: "2", name: "HTML/CSS Portfolio" },
  ] as Assignment[],

  rubrics: [
    {
      id: "1",
      name: "Database Normalization Rubric",
      unit: "1",
      assignment: "1",
      year: "2024",
      session: "S1",
      criteria: [],
    },
    {
      id: "2",
      name: "Software Design Patterns Rubric",
      unit: "2",
      assignment: "2",
      year: "2024",
      session: "S1",
      criteria: [],
    },
    {
      id: "3",
      name: "Machine Learning Algorithms Rubric",
      unit: "3",
      assignment: "3",
      year: "2023",
      session: "S2",
      criteria: [],
    },
  ] as Rubric[],

  years: ["2023", "2024"],

  tutors: [
    { id: "1", name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210" },
  ] as Tutor[],
};

export default mockDatabase;