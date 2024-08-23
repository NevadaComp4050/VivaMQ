# Front end API docs

### Note: This is a work in progress.

#### assignments/assignments:

assignment is an API for front end to display and send assignmnet information to backend. Use only for the assignment management page.

\***\*JSON format:\*\***

| Field      | Description                                | Type expected |
| ---------- | ------------------------------------------ | ------------- |
| id         | Assignment ID                              | int           |
| unit       | The name of the unit                       | string        |
| name       | The name of the assignment                 | string        |
| vivaStatus | The status of the Viva question generation | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "unit": "Unit 1",
  "name": "Assignment 1",
  "vivaStatus": "Not Generated"
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

#### units/units

units is an API for front end to display units available to the current user. Use only for the unit management page.

\***\*JSON format:\*\***

| Field       | Description                                 | Type expected |
| ----------- | ------------------------------------------- | ------------- |
| id          | Unit ID                                     | int           |
| name        | Name of the unit                            | string        |
| assignments | Number of assignments available in the unit | int           |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "System Programming",
  "assignments": 1
}
```

#### users/users

users is an API for front end to display temporary users available in the system.

\***\*JSON format:\*\***

| Field | Description       | Type expected |
| ----- | ----------------- | ------------- |
| id    | User ID           | int           |
| email | Email of the user | string        |
| role  | Role of the user  | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "email": "tutor1@uni.com",
  "role": "Tutor"
}
```

#### vivas/units

units is an API for front end to display units available to the current user to select for Viva question generation. Use only for the Viva question generation page.

\***\*JSON format:\*\***2

| Field | Description      | Type expected |
| ----- | ---------------- | ------------- |
| id    | Unit ID          | int           |
| name  | Name of the unit | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "Introduction to Programming"
}
```

#### vivas/assignments

assignments is an API for front end to display assignments available to the current user to select for Viva question generation. Use only for the Viva question generation page.

\***\*JSON format:\*\***

| Field  | Description                                                   | Type expected |
| ------ | ------------------------------------------------------------- | ------------- |
| id     | Assignment ID                                                 | string        |
| name   | Name of the assignment                                        | string        |
| unitId | Unit ID of the assignment (prefer to id field in vivas/units) | string        |

\***\*Example:\*\***

```json
{
  "id": 1,
  "name": "Assignment 1",
  "unitId": 1
}
```

#### vivas/students

students is an API for front end to display students available to assign submissions and viva

\***\*JSON format:\*\***

| Field              | Description                                    | Type expected |
| ------------------ | ---------------------------------------------- | ------------- |
| id                 | Student ID                                     | int           |
| name               | Name of the student                            | string        |
| assignmentId       | Assignment ID with which student is associated | string        |
| submissionText     | Text transcript from student's submission      | string        |
| questions          | list of questions genreated                    | array         |
| questions[].id     | Question ID                                    | int           |
| questions[].text   | Generated question                             | string        |
| questions[].status | Status of the question                         | string        |

\***\*Example:\*\***

```json
{
      "id": 1,
      "name": "John Doe",
      "assignmentId": "assignment1",
      "submissionText":
        "This is John's submission about database normalization...",
      "questions": [
        {
          "id": 1,
          "text": "Explain the concept of 3NF in database design.",
          "status": "Locked",
        },
        {
          "id": 2,
          "text": "Describe the differences between 1NF, 2NF, and 3NF.",
          "status": "Unlocked",
        },
      ],
    },
```
