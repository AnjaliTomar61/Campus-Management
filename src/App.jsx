import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./components/admindashboard/AdminDashboard";

import AdminStudentsPanel from "./components/admindashboard/AdminStudentsPanel";

import AdminFacultyPanel from "./components/admindashboard/AdminFacultyPanel";

import AdminProgramsPanel from "./components/admindashboard/AdminProgramsPanel";

import AdminSemestersPanel from "./components/admindashboard/AdminSemestersPanel";

import AdminAttendancePanel from "./components/admindashboard/AdminAttendancePanel";

import AdminProfile from "./components/admindashboard/AdminProfile";



import FacultyDashboardContain from "./components/facultydashboard/FacultyDashboardContain";

import FacultyDashboard from "./components/facultydashboard/FacultyDashboard";

import FacultyProfile from "./components/facultydashboard/FacultyProfile";

import FacultyAssignedStudents from "./components/facultydashboard/FacultyAssignedStudents";

import LandingPage from "./pages/LandingPage";

import MainLayout from "./layout/MainLayout";

import SignupPage from "./components/SignupPage";

import LoginPage from "./pages/LoginPage";

import AboutPage from "./pages/AboutPage";

import AdmissionPage from "./pages/AdmissionPage";

import InstitutesPage from "./pages/InstitutesPage";

import ContactPage from "./pages/ContactPage";

import StudentLayout from "./components/studentdashboard/StudentLayout";

import StudentDashboardContain from "./components/studentdashboard/StudentDashboardContain";

import StudentProfile from "./components/studentdashboard/StudentProfile";

import MyAttendancePanel from "./components/attendance/MyAttendancePanel";

import AdminTimetablePanel from "./components/admindashboard/AdminTimetablePanel";

import AdminResultsPanel from "./components/admindashboard/AdminResultsPanel";

import TimetableView from "./components/timetable/TimetableView";

import ResultsView from "./components/results/ResultsView";

import DashboardPlaceholder from "./components/dashboard/DashboardPlaceholder";

import ProtectedRoute from "./components/auth/ProtectedRoute";



function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<MainLayout />}>

          <Route index element={<LandingPage />} />

          <Route path="about" element={<AboutPage />} />

          <Route path="admission" element={<AdmissionPage />} />

          <Route path="institutes" element={<InstitutesPage />} />

          <Route path="contact" element={<ContactPage />} />

        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />



        <Route element={<ProtectedRoute roles={["admin"]} />}>

          <Route path="/admindashboard" element={<AdminDashboard />}>

            <Route index element={<Navigate to="students" replace />} />

            <Route path="students" element={<AdminStudentsPanel />} />

            <Route path="faculty" element={<AdminFacultyPanel />} />

            <Route path="programs" element={<AdminProgramsPanel />} />

            <Route path="semesters" element={<AdminSemestersPanel />} />

            <Route path="attendance" element={<AdminAttendancePanel />} />

            <Route path="timetable" element={<AdminTimetablePanel />} />

            <Route path="results" element={<AdminResultsPanel />} />

            <Route path="adminprofile" element={<AdminProfile />} />

            <Route path="student-academic" element={<Navigate to="/admindashboard/students" replace />} />

            <Route path="facultyform" element={<Navigate to="/admindashboard/faculty" replace />} />

            <Route path="faculty-employment" element={<Navigate to="/admindashboard/faculty" replace />} />

            <Route path="student" element={<Navigate to="/admindashboard/students" replace />} />

            <Route path="department" element={<Navigate to="/admindashboard/programs" replace />} />

            <Route path="course" element={<Navigate to="/admindashboard/programs" replace />} />

            <Route path="semester" element={<Navigate to="/admindashboard/semesters" replace />} />

            <Route path="*" element={<Navigate to="/admindashboard/students" replace />} />

          </Route>

        </Route>



        <Route element={<ProtectedRoute roles={["student"]} />}>

          {/* Trailing `/*` keeps nested paths matching reliably in React Router v7. */}
          <Route path="/studentdashboard/*" element={<StudentLayout />}>

            <Route index element={<StudentDashboardContain />} />

            <Route path="profile" element={<StudentProfile />} />

            <Route path="attendance" element={<MyAttendancePanel heading="My attendance" />} />

            <Route path="timetable" element={<TimetableView variant="student" />} />

            <Route path="results" element={<ResultsView variant="student" />} />

            <Route path="courses" element={<DashboardPlaceholder title="Courses" />} />

            <Route path="marks" element={<DashboardPlaceholder title="Marks" />} />

            <Route path="assignments" element={<DashboardPlaceholder title="Assignments" />} />

            <Route path="notice" element={<DashboardPlaceholder title="Notices" />} />

            <Route path="*" element={<Navigate to="/studentdashboard" replace />} />

          </Route>

        </Route>



        <Route element={<ProtectedRoute roles={["faculty"]} />}>

          <Route path="/facultydashboard/*" element={<FacultyDashboard />}>

            <Route index element={<FacultyDashboardContain />} />

            <Route path="profile" element={<FacultyProfile />} />

            <Route path="assigned-students" element={<FacultyAssignedStudents />} />

            <Route path="attendance" element={<MyAttendancePanel heading="Attendance" />} />

            <Route path="timetable" element={<TimetableView variant="faculty" />} />

            <Route path="results" element={<ResultsView variant="faculty" />} />

            <Route path="courses" element={<DashboardPlaceholder title="Courses" />} />

            <Route path="marks" element={<DashboardPlaceholder title="Marks" />} />

            <Route path="assignments" element={<DashboardPlaceholder title="Assignments" />} />

            <Route path="*" element={<Navigate to="/facultydashboard" replace />} />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>

  );

}



export default App;

