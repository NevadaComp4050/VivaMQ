export interface SearchItem {
  title: string
  description: string
  url: string
  keywords: string[]
  category: string
}

export const searchData: SearchItem[] = [
  {
    title: "All Assignments",
    description: "View and manage all assignments across units",
    url: "/assignments",
    keywords: ["assignments", "tasks", "homework", "projects", "submissions"],
    category: "Assignments",
  },
  {
    title: "Account Settings",
    description: "Manage your account settings and preferences",
    url: "/settings",
    keywords: ["settings", "account", "profile", "preferences", "notifications", "password"],
    category: "Settings",
  },
  {
    title: "Tutor Management",
    description: "Manage tutors and their assignments",
    url: "/tutors",
    keywords: ["tutors", "teachers", "staff", "instructors", "faculty"],
    category: "Tutors",
  },
  {
    title: "Unit Overview",
    description: "View and manage course units",
    url: "/units",
    keywords: ["units", "courses", "subjects", "modules", "classes"],
    category: "Units",
  },
  {
    title: "Unit Details",
    description: "Access unit details, assignments, and tutors",
    url: "/units",
    keywords: ["unit details", "course info", "subject statistics", "assignments", "vivas", "tutors"],
    category: "Units",
  },
  {
    title: "Assignment Management",
    description: "Manage assignments, submissions, and rubrics",
    url: "/assignments",
    keywords: ["assignments", "submissions", "rubrics", "grading", "vivas"],
    category: "Assignments",
  },
  {
    title: "Viva Sessions",
    description: "Manage viva sessions for assignments",
    url: "/vivas",
    keywords: ["viva", "oral exam", "interview", "questions", "assessment"],
    category: "Assignments",
  },
  {
    title: "Rubric Creation",
    description: "Create and manage rubrics for assignments",
    url: "/rubrics",
    keywords: ["rubric", "grading criteria", "assessment guide", "marking scheme"],
    category: "Assignments",
  },
]