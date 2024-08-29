# Front end API docs

### Note: This is a work in progress.

#### assignments/assignments:

assignment is an API for front end to display and send assignmnet information to backend. Use only for the assignment management page.

\***\*JSON format:\*\***

| Field       | Description                              | Type expected |
| ----------- | ---------------------------------------- | ------------- |
| id          | Assignment ID                            | int           |
| name        | Name of the assignment                   | string        |
| unit        | Unit name of the assignment              | string        |
| unitId      | Unit ID of the assignment                | int           |
| dueDate     | Due date of the assignment               | string        |
| submissions | Number of submissions for the assignment | int           |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "Assignment 1",
  "unit": "Introduction to Programming",
  "unitId": 1,
  "dueDate": "2023-05-20",
  "submissions": 5
}
```

#### dashboard/stats:

stats is an API for front end to display user and system statistics.

\***\*JSON format:\*\***

| Field             | Description                                                                   | Type expected |
| ----------------- | ----------------------------------------------------------------------------- | ------------- |
| totalUnits        | Total number of units available to the current user                           | int           |
| activeAssignments | Total number of active assignments available to the current user              | int           |
| pendingVivas      | Total number of pending Viva questions that hasn't been processed by the user | int           |
| activeUsers       | Total number of active users in the system                                    | int           |

\***\*Example:\*\***

```json
{
  "totalUnits": 5,
  "activeAssignments": 3,
  "pendingVivas": 2,
  "activeUsers": 10
}
```

#### dashboard/recentActivities

recentActivities is an API for front end to display recent activities prcessed on the system for a specific user.

\***\*JSON format:\*\***

| Field  | Description                                            | Type expected |
| ------ | ------------------------------------------------------ | ------------- |
| id     | Activity ID                                            | int           |
| type   | Type of the activity on the system                     | string        |
| action | Type of action related to the type of activity occured | string        |
| name   | Name of the activities                                 | string        |
| date   | timestamp of the activity                              | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "type": "Assignment",
  "action": "Created",
  "name": "Advanced Machine Learning",
  "date": "2023-05-15"
}
```

#### dashboard/upcomingVivas

upcomingVivas is an API for front end to display upcoming Viva schedules for the current user.

\***\*JSON format:\*\***

| Field      | Description            | Type expected |
| ---------- | ---------------------- | ------------- |
| id         | Viva ID                | int           |
| student    | Name of the student    | string        |
| assignment | Name of the assignment | string        |
| date       | Date of the Viva       | string        |
| time       | Time of the Viva       | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "student": "Alice Johnson",
  "assignment": "Data Structures",
  "date": "2023-05-20",
  "time": "10:00 AM"
}
```

#### dashboard/pendingTasks

pendingTasks is an API for front end to display pending tasks assigned to the current user.

\***\*JSON format:\*\***

| Field   | Description                    | Type expected |
| ------- | ------------------------------ | ------------- |
| id      | Task ID                        | int           |
| task    | Name of the task assigned      | string        |
| dueDate | Due date of the task asswigned | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "task": "Complete the assignment",
  "dueDate": "2023-05-20"
}
```

#### settings/users

users is an API for front end to display current user's information and settings.

\***\*JSON format:\*\***

| Field                 | Description                    | Type expected |
| --------------------- | ------------------------------ | ------------- |
| name                  | Name of the user               | string        |
| email                 | Email of the user              | string        |
| notifications         | Array of notification settings | array         |
| notifications[].email | Email notification setting     | boolean       |
| notifications[].push  | Push notification setting      | boolean       |

\***\*Example:\*\***

```json
{
  "name": "John Doe",
  "email": "john.doe@uni.com",
  "notifications": [
    {
      "email": true,
      "push": false
    }
  ]
}
```

#### tutors/tutors

tutors is an API for front end to display tutors with lower permissions assigned/available to the current user. Use only for the tutor management page.

\***\*JSON format:\*\***

| Field | Description        | Type expected |
| ----- | ------------------ | ------------- |
| id    | Tutor ID           | int           |
| name  | Name of the tutor  | string        |
| email | Email of the tutor | string        |
| units | assigned units     | array         |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "Tutor 1",
  "email": "john.doe@uni.com",
  "units": ["System Programming", "Data Structures"]
}
```

#### tutors/tutorId/tutor

tutor is an API for front end to manipulate lower permission tutor's information. Use only for the tutor management page.

\***\*JSON format:\*\***

| Field | Description               | Type expected |
| ----- | ------------------------- | ------------- |
| id    | Tutor ID                  | int           |
| name  | Name of the tutor         | string        |
| email | Email of the tutor        | string        |
| phone | Phone number of the tutor | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "Tutor 1",
  "email": "jon@uni.com",
  "phone": "1234567890"
}
```

#### tutors/tutorId/units

units is an API for front end to manipulate lower permission tutor's allocated units. Use only for the tutor management page.

\***\*JSON format:\*\***

| Field    | Description      | Type expected |
| -------- | ---------------- | ------------- |
| id       | Unit ID          | int           |
| name     | Name of the unit | string        |
| assigned | assigned status  | boolean       |

#### units/units

units is an API for front end to display units available to the current user. Use only for the unit management page.

\***\*JSON format:\*\***

| Field       | Description                                 | Type expected |
| ----------- | ------------------------------------------- | ------------- |
| id          | Unit ID                                     | int           |
| name        | Name of the unit                            | string        |
| assignments | Number of assignments available in the unit | int           |
| tutors      | Number of tutors assigned to the unit       | int           |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "System Programming",
  "assignments": 1,
  "tutors": 2
}
```

#### units/unitId/unit

unit is an API for front end to display unit information. Use only for the unit management page.

\***\*JSON format:\*\***

| Field                          | Description                                                 | Type expected |
| ------------------------------ | ----------------------------------------------------------- | ------------- |
| id                             | Unit ID                                                     | int           |
| name                           | Name of the unit                                            | string        |
| description                    | Description of the unit                                     | string        |
| assignments                    | Number of assignments available in the unit                 | int           |
| tutors                         | Number of tutors assigned to the unit                       | int           |
| assignmentStats                | Assignment statistics for the unit                          | array         |
| assignmentStats[].name         | Name of the assignment                                      | string        |
| assignmentStats[].submissions  | Number of submissions for the assignment                    | int           |
| assignmentStats[].completed    | Number of completed (marked) submissions for the assignment | int           |
| assignmentStats[].averageScore | Average score of the assignment                             | float         |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "System Programming",
  "description": "This unit covers the basics of system programming...",
  "assignments": 1,
  "tutors": 2,
  "assignmentStats": [
    {
      "name": "Assignment 1",
      "submissions": 5,
      "completed": 3,
      "averageScore": 75.5
    }
  ]
}
```

#### units/unitId/assignments/assignments

assignments is an API for front end to display assignments available to the current user. Use only for the unit management page.

\***\*JSON format:\*\***

| Field       | Description                              | Type expected |
| ----------- | ---------------------------------------- | ------------- |
| id          | Assignment ID                            | string        |
| name        | Name of the assignment                   | string        |
| dueDate     | Due date of the assignment               | string        |
| submissions | Number of submissions for the assignment | int           |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "Query Optimization",
  "dueDate": "2023-05-20",
  "submissions": 5
}
```

#### units/unitId/assignments/assignmentIdassignment

assignment is an API for front end to manipulate and display assignment information. Use only for the unit management page.

\***\*JSON format:\*\***

| Field                        | Description                           | Type expected |
| ---------------------------- | ------------------------------------- | ------------- |
| id                           | Assignment ID                         | string        |
| name                         | Name of the assignment                | string        |
| description                  | Description of the assignment         | string        |
| dueDate                      | Due date of the assignment            | string        |
| submissions                  | array of submissions by the students  | array         |
| submissions[].id             | Submission ID                         | int           |
| submissions[].studentName    | Name of the student                   | string        |
| submissions[].submissionDate | Date of the submission                | string        |
| submissions[].status         | Status of the submission              | string        |
| submissions[].vivaStatus     | Status of the viva generation process | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "Query Optimization",
  "description": "Analyze and normalize...",
  "dueDate": "2023-05-20",
  "submissions": [
    {
      "id": 1,
      "studentName": "Alice Johnson",
      "submissionDate": "2023-05-15",
      "status": "Submitted",
      "vivaStatus": "Pending"
    }
  ]
}
```

#### units/unitId/assignments/assignmentId/rubric/ULO

ULO is an API for front end to display Unit Learning Outcomes (ULO) for the assignment. Use only for the unit management page.

\***\*JSON format:\*\***

| Field       | Description            | Type expected |
| ----------- | ---------------------- | ------------- |
| id          | ULO ID                 | int           |
| description | Description of the ULO | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "description": "Analyze and normalize..."
}
```

#### units/unitId/assignments/assignmentId/vivas/vivas

vivas is an API for front end to display Viva question generation status for the assignment. Use only for the unit management page.

\***\*JSON format:\*\***

| Field       | Description                           | Type expected |
| ----------- | ------------------------------------- | ------------- |
| id          | Viva ID                               | int           |
| studentName | Name of the student                   | string        |
| assignment  | Name of the assignment                | string        |
| status      | Status of the Viva generation process | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "studentName": "Alice Johnson",
  "assignment": "Query
  Optimization",
  "status": "Pending"
}
```
#### units/unitId/assignments/assignmentId/vivas/vivaId/viva

viva is an API for front end to display Viva question generated for the student. Use only for the unit management page.

\***\*JSON format:\*\***

| Field       | Description                           | Type expected |
| ----------- | ------------------------------------- | ------------- |
| id          | Viva ID                               | int           |
| studentName | Name of the student                   | string        |
| assignmentName  | Name of the assignment                | string        |
| submissionDate | Date of the submission                | string        |
| content | submission content | string        |
| questions | array of questions | array        |
| questions[].id | question ID | int        |
| questions[].text | generated question | string        |
| questions[].status | status of the question | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "studentName": "Alice Johnson",
  "assignmentName": "Query Optimization",
  "submissionDate": "2023-05-15",
  "content": "Analyze and normalize...",
  "questions": [
    {
      "id": 1,
      "text": "What is the purpose of normalization?",
      "status": "Pending"
    }
  ]
}
```
#### units/unitId/assignments/assignmentId/vivas/vivaId/submissionId/submission

submission is an API for front end to display and manipulate student submission information. Use only for the unit management page.

\***\*JSON format:\*\***

| Field       | Description                           | Type expected |
| ----------- | ------------------------------------- | ------------- |
| id          | Submission ID                               | int           |
| studentName | Name of the student                   | string        |
| assignmentName  | Name of the assignment                | string        |
| submissionDate | Date of the submission                | string        |
| content | submission content | string        |
| questions | array of questions | array        |
| questions[].id | question ID | int        |
| questions[].text | generated question | string        |
| questions[].status | status of the question | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "studentName": "Alice Johnson",
  "assignmentName": "Query Optimization",
  "submissionDate": "2023-05-15",
  "content": "Analyze and normalize...",
  "questions": [
    {
      "id": 1,
      "text": "What is the purpose of normalization?",
      "status": "Pending"
    }
  ]
}
```
#### units/unitId/tutors/tutors

tutors is an API for front end to display and manipulate tutors assigned to the unit. Use only for the unit management page.

\***\*JSON format:\*\***

| Field | Description        | Type expected |
| ----- | ------------------ | ------------- |
| id    | Tutor ID           | int           |
| name  | Name of the tutor  | string        |
| email | Email of the tutor | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "Jess",
  "email": "jess@uni.com"
}
```

