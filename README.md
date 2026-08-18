# CampusConnect LMS 🎓

> **Academic Learning Management System & Telemetry Signal Engine**
> 
> *Component of the CampusConnect AI-powered Academic Dropout Prediction & Intervention Platform (SIH 2026).*

---

## 🌟 Overview

**CampusConnect LMS** is a clean, scalable React learning management system tailored for modern higher education institutions. Designed around the principle of **"Complex functionality behind the scenes, extremely simple interface for students and faculty"**, it delivers a frictionless academic workspace while silently capturing critical learning-behaviour telemetry signals required for AI-driven dropout risk prediction.

---

## 🚀 Key Features

### 👨‍🎓 Student Experience
1. **Student Dashboard**: Overview of enrolled courses, average completion progress, upcoming task deadlines, and cumulative GPA.
2. **My Courses**: Grid view of active semester subjects with interactive search and progress indicators.
3. **Course Details**: Tabbed interface featuring Course Syllabus, Announcements, and Module Lists.
4. **Interactive Module Viewer**: Video streaming player with simulated video start/completion events, downloadable reading resources, and completion toggles.
5. **Assignments Hub**: Assignment tracking, status filters (Pending, Submitted, Graded), file submission modal, and faculty score feedback.
6. **Quizzes & Assessments**: Interactive auto-graded quiz runner with instant feedback and score logging.
7. **Progress Analytics**: Time active on platform, modules completed breakdown, and live activity stream.

### 👩‍🏫 Faculty Experience
1. **Faculty Command Center**: Teaching overview, course cards, pending grading queue, and student risk watchlist.
2. **Course Management**: Module publisher to draft and release new learning resources, video lectures, and syllabus units.
3. **Assignment Grading**: Submission review interface with mark allocation and feedback text tools.
4. **Quiz Management**: Quiz list and performance stats.
5. **Student Performance**: Roster matrix tracking student attendance %, average quiz performance, and assignment completion.
6. **Engagement & Risk Matrix**: Real-time signal dashboard displaying student active hours, module view counts, missed deadlines, and dropout risk tiers.

---

## 📡 Signal Telemetry Engine (`lmsEvents.js`)

The LMS features a dedicated event telemetry engine that records student learning behaviour across 18 key data points:
- `studentId`, `courseId`, `moduleId`
- Timestamps (`loginTimestamp`, `lastActiveTimestamp`)
- Module interaction (`moduleViewed`, `moduleCompleted`)
- Resource access (`learningMaterialAccessed`)
- Video engagement (`videoStarted`, `videoCompleted`)
- Submissions (`assignmentAttempted`, `assignmentSubmitted`, `assignmentScore`)
- Quizzes (`quizAttempted`, `quizScore`)
- Aggregate signals (`courseProgress`, `totalTimeSpentMinutes`, `missedAssignments`)

*(Click the **"Telemetry Signals"** button in the header bar during an SIH presentation to view live captured signal logs).*

---

## 🏗️ Project Structure

```
campusconnect-lms/
├── public/
├── src/
│   ├── components/
│   │   └── common/           # Navbar, Sidebar, StatCard, EventTrackerDrawer
│   ├── context/              # AuthContext (Role switching: Student vs Faculty)
│   ├── data/                 # Mock dataset (Courses, Modules, Assignments, Quizzes, Students)
│   ├── layouts/              # MainLayout shell
│   ├── pages/
│   │   ├── auth/             # Login role-selection portal
│   │   ├── student/          # Student experience pages
│   │   └── faculty/          # Faculty management & signal intake pages
│   ├── routes/               # AppRoutes (React Router v6)
│   ├── services/             # apiClient (Mock layer), lmsEvents (Signal Engine)
│   └── styles/               # index.css (Tailwind CSS + Custom UI tokens)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🔗 Planned REST API Backend Integration

The frontend architecture uses an abstracted API client (`src/services/apiClient.js`) and event dispatcher (`src/services/lmsEvents.js`). 

When integrating with the future CampusConnect Django / Node / FastAPI backend:
1. Replace mock Promise resolvers in `apiClient.js` with `fetch` or `axios` calls to backend endpoint routes (`/api/v1/courses`, `/api/v1/assignments`, `/api/v1/quizzes`).
2. Point `recordEvent()` in `lmsEvents.js` to post telemetry payloads to `/api/v1/telemetry/signals` for real-time AI model inference.
