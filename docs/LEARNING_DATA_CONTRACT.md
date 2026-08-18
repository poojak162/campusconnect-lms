# CampusConnect LMS — Learning Data Contract

> **Contract Version**: 1.0.0  
> **Target Consumer**: CampusConnect Academic Dropout Prediction & Intervention Backend Engine  
> **Source Component**: CampusConnect LMS Frontend (`src/services/activityLogger.js`)

---

## 📌 Architecture Data Flow

```
+------------------+
|   LMS UI Layer   |
+------------------+
         |
         v
+-----------------------------+
|  Service Layer              |
|  (activityLogger.js)        |
+-----------------------------+
         |
         +----------------------------------+
         |                                  |
         v                                  v
+------------------+             +--------------------+
| Current MVP:     |             | Future REST API:   |
| localStorage     |             | POST /api/v1/      |
| (campusconnect_  |             | learning-activities|
|  activities)     |             +--------------------+
+------------------+                        |
                                            v
                                 +--------------------+
                                 | CampusConnect      |
                                 | Backend Engine     |
                                 +--------------------+
                                            |
                                            v
                                 +--------------------+
                                 | AI Dropout Risk    |
                                 | Prediction System  |
                                 +--------------------+
```

---

## 📋 Standardized Activity Event Schema

Every student action within the LMS produces a JSON telemetry event adhering to the schema below:

```json
{
  "id": "string (unique ID, format: act_{timestamp}_{randomHash})",
  "studentId": "string (student identifier e.g., STU-1001)",
  "courseId": "string | null (course identifier e.g., CS101)",
  "moduleId": "string | null (module identifier e.g., MOD-104)",
  "activityType": "string (enum of supported activity types)",
  "timestamp": "string (ISO 8601 UTC timestamp)",
  "score": "number | null (numeric score for quizzes or assignments)",
  "progress": "number | null (percentage integer 0-100 of course completion)"
}
```

*Note: Fields that are not applicable for a specific activity type are set to `null`.*

---

## ⚡ Supported Activity Types

| Activity Type | Description | Trigger Moment | Applicable Fields |
|---|---|---|---|
| `LOGIN` | Student logged into the LMS | Role selection portal login | `studentId`, `timestamp` |
| `COURSE_OPENED` | Student opened a course view | Navigating to Course Details | `studentId`, `courseId`, `timestamp`, `progress` |
| `MODULE_VIEWED` | Student accessed a module page | Opening module video/text page | `studentId`, `courseId`, `moduleId`, `timestamp` |
| `MODULE_COMPLETED` | Student completed a module | Clicking "Mark as Complete" | `studentId`, `courseId`, `moduleId`, `timestamp`, `progress` |
| `ASSIGNMENT_STARTED` | Student began assignment submission | Opening submission modal | `studentId`, `courseId`, `timestamp`, `progress` |
| `ASSIGNMENT_SUBMITTED` | Student submitted coursework | Confirming file submission | `studentId`, `courseId`, `timestamp`, `progress` |
| `QUIZ_STARTED` | Student launched a quiz runner | Clicking "Start Quiz" | `studentId`, `courseId`, `timestamp`, `progress` |
| `QUIZ_SUBMITTED` | Student submitted quiz answers | Submitting quiz for scoring | `studentId`, `courseId`, `timestamp`, `score`, `progress` |

---

## 💡 Realistic JSON Event Examples

### Example 1: Module Completion (`MODULE_COMPLETED`)
```json
{
  "id": "act_1786989912045_x89a",
  "studentId": "STU-1001",
  "courseId": "CS101",
  "moduleId": "MOD-104",
  "activityType": "MODULE_COMPLETED",
  "timestamp": "2026-08-18T00:48:32.104Z",
  "score": null,
  "progress": 75
}
```

### Example 2: Assignment Submission (`ASSIGNMENT_SUBMITTED`)
```json
{
  "id": "act_1786989945112_b4c1",
  "studentId": "STU-1001",
  "courseId": "CS101",
  "moduleId": null,
  "activityType": "ASSIGNMENT_SUBMITTED",
  "timestamp": "2026-08-18T00:49:05.112Z",
  "score": null,
  "progress": 82
}
```

### Example 3: Quiz Submission & Scoring (`QUIZ_SUBMITTED`)
```json
{
  "id": "act_1786989980991_k9m2",
  "studentId": "STU-1001",
  "courseId": "CS101",
  "moduleId": null,
  "activityType": "QUIZ_SUBMITTED",
  "timestamp": "2026-08-18T00:49:40.991Z",
  "score": 25,
  "progress": 88
}
```

---

## 📊 Basic Learning Metrics

The service layer computes core learning-behaviour metrics directly from stored events:

1. **Last Active Timestamp**:
   $$\text{Last Active Time} = \max(\text{timestamp} \text{ for } \text{studentId})$$
2. **Recent Activity Count (Past $N$ Days)**:
   $$\text{Recent Activity Count} = \text{Count}(\text{events} \text{ where } \text{timestamp} \ge \text{Now} - N \text{ days})$$
3. **Assignment Completion Rate (%)**:
   $$\text{Assignment Rate} = \min\left(100, \left(\frac{\text{ASSIGNMENT\_SUBMITTED}}{\text{ASSIGNMENT\_STARTED}}\right) \times 100\right)$$
4. **Average Quiz Score**:
   $$\text{Avg Quiz Score} = \frac{\sum \text{score}(\text{QUIZ\_SUBMITTED})}{\text{Count}(\text{QUIZ\_SUBMITTED})}$$
5. **Overall Course Progress (%)**:
   $$\text{Overall Progress} = \text{Latest non-null } \text{progress} \text{ entry}$$

---

## 💾 Storage & REST API Migration Plan

### MVP Storage Location
Events are persisted in `localStorage` under the key:
`campusconnect_activities`

### REST API Integration
To replace `localStorage` with a live REST backend:
1. Update `recordActivity()` in `src/services/activityLogger.js` to send HTTP POST requests:
   ```http
   POST /api/v1/learning-activities
   Content-Type: application/json

   {
     "studentId": "STU-1001",
     "courseId": "CS101",
     "moduleId": "MOD-104",
     "activityType": "MODULE_COMPLETED",
     "timestamp": "2026-08-18T00:48:32.104Z",
     "score": null,
     "progress": 75
   }
   ```
2. Update `getStudentActivities()` to query:
   ```http
   GET /api/v1/students/STU-1001/activities?limit=50
   ```
3. Because all React components read and write data exclusively via `src/services/activityLogger.js`, **zero UI components need to be modified** when connecting to the production REST API backend.
