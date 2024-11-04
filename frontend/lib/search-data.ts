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
    url: "/dashboard/assignments",
    keywords: ["assignments", "tasks", "homework", "projects", "submissions"],
    category: "Assignments",
  },
  {
    title: "Rubric Creation",
    description: "Create and manage rubrics for assignments",
    url: "/dashboard/rubrics",
    keywords: ["rubric", "grading criteria", "assessment guide", "marking scheme"],
    category: "Assignments",
  },
  {
    title: "Create Unit",
    description: "Create a new unit to organize assignments",
    url: "/dashboard/units/create",
    keywords: ["unit", "course", "module", "semester"],
    category: "Units",
  }
]