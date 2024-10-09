# Backend API Documentation

### Disclosure

The markdown formatting of this document was completed with the assistance of a large langauge model.


## Table of Contents

1. [Assignments API](#assignments-api)
   - [Get All Assignments](#get-all-assignments)
   - [Create Assignment](#create-assignment)
   - [Delete All Assignments](#delete-all-assignments)
2. [Submissions API](#submissions-api)
   - [Create Submission](#create-submission)
   - [Get All Submissions](#get-all-submissions)
   - [Map Student to Submission](#map-student-to-submission)
   - [Get Submission-Student Mappings](#get-submission-student-mappings)
3. [Students API](#students-api)
   - [Get All Students](#get-all-students)
   - [Create Student](#create-student)
   - [Delete All Students](#delete-all-students)
4. [Tutors API](#tutors-api)
   - [Get All Tutors](#get-all-tutors)
   - [Create Tutor](#create-tutor)
   - [Delete All Tutors](#delete-all-tutors)
5. [Units API](#units-api)
   - [Get All Units](#get-all-units)
   - [Create Unit](#create-unit)
   - [Delete All Units](#delete-all-units)
   - [Get Assignments by Unit](#get-assignments-by-unit)
6. [Users API](#users-api)
   - [Get All Users](#get-all-users)
   - [Create User](#create-user)
   - [Delete All Users](#delete-all-users)

---

## Assignments API

### Get All Assignments

**Endpoint:** `GET /assignments/getall`

**Description:** Retrieves a list of all assignments.

**Sample Response:**
```json
[
  {
    "id": "1",
    "name": "Assignment 1",
    "aiModel": "gpt_4o",
    "specs": "Project specs",
    "settings": "Project settings",
    "unitId": "unit_123"
  }
]
```

### Create Assignment

**Endpoint:** `POST /assignments`

**Description:** Creates a new assignment.

**Request Body:**
```json
{
  "name": "New Assignment",
  "aiModel": "gpt_4o",
  "specs": "specs",
  "settings": "settings",
  "unitId": "unit_123"
}
```

**Sample Response:**
```json
{
  "id": "2",
  "name": "New Assignment",
  "aiModel": "GPT-4",
  "specs": "specs",
  "settings": "settings",
  "unitId": "unit_123"
}
```

### Delete All Assignments

**Endpoint:** `GET /assignments/deleteall`

**Description:** Deletes all assignments.

**Sample Response:**
```json
{
  "count": 10
}
```

---

## Submissions API

### Create Submission

**Endpoint:** `POST /assignments/:assignmentId/submissions`

**Description:** Creates a new submission for an assignment.

**Request Body:**
- A file named `submissionFile` is expected via multipart form data.

**Sample Response:**
```json
{
  "id": "sub_123",
  "assignmentId": "1",
  "studentId": null,
  "submissionFile": "file.pdf"
}
```

### Get All Submissions

**Endpoint:** `GET /assignments/:assignmentId/submissions`

**Description:** Retrieves all submissions for a specific assignment.

**Query Parameters:**
- `limit`: The number of results to return (default: 10).
- `offset`: The starting index for the query (default: 0).

**Sample Response:**
```json
[
  {
    "id": "sub_123",
    "assignmentId": "1",
    "studentId": "student_123",
    "submissionFile": "file.pdf"
  }
]
```

### Map Student to Submission

**Endpoint:** `POST /assignments/:assignmentId/submissionMapping/:submissionId`

**Description:** Maps a student to a specific submission.

**Request Body:**
```json
{
  "studentId": "student_123"
}
```

**Sample Response:**
```json
{
  "id": "sub_123",
  "studentId": "student_123"
}
```

### Get Submission-Student Mappings

**Endpoint:** `GET /assignments/:assignmentId/submissionMapping`

**Description:** Retrieves the mappings between students and their submissions for a specific assignment.

**Sample Response:**
```json
[
  {
    "submissionId": "sub_123",
    "studentId": "student_123",
    "studentName": "Adrian Kane"
  }
]
```

---

## Students API

### Get All Students

**Endpoint:** `GET /students/getall`

**Description:** Retrieves a list of all students.

**Sample Response:**
```json
[
  {
    "id": "student_123",
    "name": "Adrian Kane",
    "email": "adrian@example.com"
  }
]
```

### Create Student

**Endpoint:** `POST /students/create`

**Description:** Creates a new student.

**Request Body:**
```json
{
  "name": "Debashish Kumar",
  "email": "debashish@example.com"
}
```

**Sample Response:**
```json
{
  "id": "student_456",
  "name": "Debashish Kumar",
  "email": "debashish@example.com"
}
```

### Delete All Students

**Endpoint:** `GET /students/deleteall`

**Description:** Deletes all students.

**Sample Response:**
```json
{
  "count": 20
}
```

---

## Tutors API

### Get All Tutors

**Endpoint:** `GET /tutors/getall`

**Description:** Retrieves a list of all tutors.

**Sample Response:**
```json
[
  {
    "id": "tutor_123",
    "name": "Debashish Kumar",
    "email": "debashish@example.com",
    "unitId": "unit_123"
  }
]
```

### Create Tutor

**Endpoint:** `POST /tutors/create`

**Description:** Creates a new tutor.

**Request Body:**
```json
{
  "name": "Adrian Kane",
  "email": "adrian@example.com",
  "unitId": "unit_123"
}
```

**Sample Response:**
```json
{
  "id": "tutor_456",
  "name": "Adrian Kane",
  "email": "adrian@example.com",
  "unitId": "unit_123"
}
```

### Delete All Tutors

**Endpoint:** `GET /tutors/deleteall`

**Description:** Deletes all tutors.

**Sample Response:**
```json
{
  "count": 15
}
```

---

## Units API

### Get All Units

**Endpoint:** `GET /units`

**Description:** Retrieves a list of all units with pagination.

**Query Parameters:**
- `limit`: The number of results to return (default: 10).
- `offset`: The starting index for the query (default: 0).

**Sample Response:**
```json
[
  {
    "id": "unit_123",
    "name": "Software Engineering",
    "year": 2024
  }
]
```

### Create Unit

**Endpoint:** `POST /units`

**Description:** Creates a new unit.

**Request Body:**
```json
{
  "name": "Data Science",
  "year": 2023,
  "convenorId": "convenor_123"
}
```

**Sample Response:**
```json
{
  "id": "unit_456",
  "name": "Data Science",
  "year": 2023
}
```

### Delete All Units

**Endpoint:** `GET /units/deleteall`

**Description:** Deletes all units.

**Sample Response:**
```json
{
  "count": 5
}
```

### Get Assignments by Unit

**Endpoint:** `GET /units/:unitId/assignments`

**Description:** Retrieves all assignments for a specific unit with pagination.

**Sample Response:**
```json
[
  {
    "id": "assignment_123",
    "name": "Final Project",
    "aiModel": "GPT-4",
    "specs": "Specifications",
    "settings": "Settings"
  }
]
```

---

## Users API

### Get All Users

**Endpoint:** `GET /users`

**Description:** Retrieves a list of all users.

**Sample Response:**
```json
[
  {
    "id": "user_123",
    "email": "test@example.com",
    "name": "Test User"
  }
]
```

### Create User

**Endpoint:** `POST /users`

**Description:** Creates a new user.

**Request Body:**
```

json
{
  "email": "adrian@example.com",
  "name": "Adrian Kane",
  "password": "securepassword123"
}
```

**Sample Response:**
```json
{
  "id": "user_456",
  "email": "adrian@example.com",
  "name": "Adrian Kane"
}
```

### Delete All Users

**Endpoint:** `GET /users/deleteall`

**Description:** Deletes all users.

**Sample Response:**
```json
{
  "count": 10
}
```

---