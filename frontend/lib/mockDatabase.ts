export interface Unit {
  id: string;
  name: string;
  code: string;
  year: string;
  session: string;
}

export interface Assignment {
  id: string;
  unitId: string;
  name: string;
  description?: string;
  dueDate?: string;
  submissions?: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  submissionDate: string;
  status: string;
  content: string;
}

export interface Viva {
  id: string;
  assignmentId: string;
  studentName: string;
  status: string;
  questions: VivaQuestion[];
}

export interface VivaQuestion {
  id: string;
  text: string;
  status: "Locked" | "Unlocked";
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
    {
      id: "1",
      name: "Introduction to Programming",
      code: "COMP101",
      year: "2023",
      session: "Session 1",
    },
    {
      id: "2",
      name: "Web Development",
      code: "COMP201",
      year: "2023",
      session: "Session 2",
    },
    {
      id: "3",
      name: "Database Systems",
      code: "COMP301",
      year: "2024",
      session: "Session 1",
    },
  ] as Unit[],

  assignments: [
    {
      id: "1",
      unitId: "1",
      name: "Programming Basics Quiz",
      description: "A quiz covering basic programming concepts",
      dueDate: "2023-05-15",
      submissions: 20,
    },
    {
      id: "2",
      unitId: "1",
      name: "Simple Calculator Project",
      description: "Build a simple calculator using Python",
      dueDate: "2023-06-01",
      submissions: 18,
    },
    {
      id: "3",
      unitId: "2",
      name: "HTML/CSS Portfolio",
      description: "Create a personal portfolio website using HTML and CSS",
      dueDate: "2023-06-15",
      submissions: 22,
    },
    {
      id: "4",
      unitId: "3",
      name: "Database Design Project",
      description:
        "Design and implement a relational database for a given scenario",
      dueDate: "2024-05-30",
      submissions: 15,
    },
  ] as Assignment[],

  submissions: [
    {
      id: "1",
      assignmentId: "1",
      studentName: "Alice Johnson",
      submissionDate: "2023-05-10",
      status: "Submitted",
      content: "Quiz answers...",
    },
    {
      id: "2",
      assignmentId: "1",
      studentName: "Bob Smith",
      submissionDate: "2023-05-12",
      status: "Submitted",
      content: "Quiz answers...",
    },
    {
      id: "3",
      assignmentId: "2",
      studentName: "Charlie Brown",
      submissionDate: "2023-05-25",
      status: "Submitted",
      content: "Calculator code...",
    },
    {
      id: "4",
      assignmentId: "3",
      studentName: "Diana Prince",
      submissionDate: "2023-06-10",
      status: "Submitted",
      content: "Portfolio website code...",
    },
  ] as Submission[],

  vivas: [
    {
      id: "1",
      assignmentId: "1",
      studentName: "Alice Johnson",
      status: "Scheduled",
      questions: [
        {
          id: "1",
          text: "Explain variable scoping in Python",
          status: "Unlocked",
        },
        {
          id: "2",
          text: "Describe the difference between a list and a tuple",
          status: "Locked",
        },
      ],
    },
    {
      id: "2",
      assignmentId: "2",
      studentName: "Charlie Brown",
      status: "Completed",
      questions: [
        {
          id: "3",
          text: "Explain your approach to error handling in the calculator",
          status: "Unlocked",
        },
        {
          id: "4",
          text: "How would you extend your calculator to support scientific functions?",
          status: "Unlocked",
        },
      ],
    },
  ] as Viva[],

  rubrics: [
    {
      id: "1",
      name: "Programming Basics Quiz Rubric",
      unit: "1",
      assignment: "1",
      year: "2023",
      session: "Session 1",
      criteria: [
        {
          id: 1,
          name: "Understanding of Variables",
          marks: 10,
          descriptors: {
            HD: "Excellent understanding",
            D: "Good understanding",
            C: "Fair understanding",
            P: "Basic understanding",
            F: "Poor understanding",
          },
        },
        {
          id: 2,
          name: "Control Structures",
          marks: 10,
          descriptors: {
            HD: "Excellent grasp",
            D: "Good grasp",
            C: "Fair grasp",
            P: "Basic grasp",
            F: "Poor grasp",
          },
        },
      ],
    },
    {
      id: "2",
      name: "Simple Calculator Project Rubric",
      unit: "1",
      assignment: "2",
      year: "2023",
      session: "Session 1",
      criteria: [
        {
          id: 1,
          name: "Functionality",
          marks: 15,
          descriptors: {
            HD: "All operations work flawlessly",
            D: "Most operations work correctly",
            C: "Basic operations work",
            P: "Some operations work",
            F: "Major functionality issues",
          },
        },
        {
          id: 2,
          name: "Code Quality",
          marks: 15,
          descriptors: {
            HD: "Excellent, well-structured code",
            D: "Good code structure",
            C: "Acceptable code structure",
            P: "Poor code structure",
            F: "Unacceptable code quality",
          },
        },
      ],
    },
  ] as Rubric[],

  years: ["2023", "2024", "2025"],

  tutors: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "987-654-3210",
    },
  ] as Tutor[],
};

export default mockDatabase;
