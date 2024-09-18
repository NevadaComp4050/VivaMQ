# Sammarizing frontend api document
Frontend API doc is a little too long to read.

## Requirements - BE
User actions should be tracked. Tutors should be able to see tasks they are assigned (Implies that the viva Proceedure itself is being considered by FE).

### Attributes for Identified entities
- Assignment
    - ID
    - Name
    - Unit
    - dueDate
    - numSubmissions
- User
    - notification settings
    - notifcation settings / settings
- Tutor
    - ID
    - name
    - email
    - phone
    - units
- Rubric
    - ULO
        - ID and string
- Unit
  - ID
- Viva
    - ID
    - GeneratedQuestions
    - ULOs assessed
    - status
    - student
    - assignment

## Section Summaries

### [dashboard/recentActivities](Frontend-api-docs.md#assignmentsassignments)
Assignment defined

### [dashboard/stats:](Frontend-api-docs.md#dashboardstats)
RequestMetadata about units, assignments, Vivas, online users

### [dashboard/recentActivities](Frontend-api-docs.md#dashboardrecentActivities)
Information about the most recent user activity with the system.
- Timestamps
- Action types

### [dashboard/upcomingVivas](Frontend-api-docs.md#dashboardupcomingVivas)
Viva as an event. Topic / time:date

### [dashboard/pendingTasks](Frontend-api-docs.md#dashboardpendingTasks)
Alludes to some proceedure that users have to follow at set times.

### [settings/users](Frontend-api-docs.md#settingsusers)
User identifiers, an array of booleans for control, in this case for notifications.

### [tutors/tutors](Frontend-api-docs.md#tutorstutors)
Used for tutor management, unclear what this does.

### [tutors/tutorId/tutor](Frontend-api-docs.md#tutorstutorIdtutor)
Manipulate tutors... This is the same thing.

### [tutors/tutorId/units](Frontend-api-docs.md#tutorstutorIdunits)
Manipulate tutors.units... Again same thing.

### [units/units](Frontend-api-docs.md#unitsunits)
Query db for units and display unit with list of assignments and tutors.

### [units/unitId/unit](Frontend-api-docs.md#unitsunitIdunit)
Display all information with 1 degree of seperation from a unit.
- Implies we are tracking the grade and status of assignments?
  - Where is the design for this?

### [units/unitId/assignments/assignments](Frontend-api-docs.md#unitsunitIdassignmentsassignments)
Assignment stats. Select * from ass where user=me.

### [units/unitId/assignments/assignmentIdassignment](Frontend-api-docs.md#unitsunitIdassignmentsassignmentIdassignment)
Assignment manipulation, includes data about all current submissions?

### [units/unitId/assignments/assignmentId/rubric/ULO](Frontend-api-docs.md#unitsunitIdassignmentsassignmentIdrubricULO)
Unit learning outcomes.

### [units/unitId/assignments/assignmentId/vivas/vivas](Frontend-api-docs.md#unitsunitIdassignmentsassignmentIdvivasvivas)
Retrieve viva generation status.

### [units/unitId/assignments/assignmentId/vivas/vivaId/viva](unitsunitIdassignmentsassignmentIdvivasvivaIdviva)
Viva itself. Implicitly defined here.

### [units/unitId/assignments/assignmentId/vivas/vivaId/submissionId/submission](unitsunitIdassignmentsassignmentIdvivasvivaIdsubmissionIdsubmission)
All assignment details, including the additional viva details for that assignment.

### [units/unitId/tutors/tutors](Frontend-api-docs.md#unitsunitIdtutorstutors)
Tutors again...