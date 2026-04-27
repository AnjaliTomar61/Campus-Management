import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from './components/admindashboard/AdminDashboard';
import AdminDashboardContain from "./components/admindashboard/AdmindashboardContain";
import Student from "./components/admindashboard/Student"
import FacultyForm from "./components/admindashboard/FacultyForm";
import Department from "./components/admindashboard/Department"
import AdminAttendance from "./components/admindashboard/AdminAttendance";


import FacultyDashboardContain from "./components/facultydashboard/FacultyDashboardContain"
import FacultyDashboard from "./components/facultydashboard/Facultydashboard";
import FacultyProfile from "./components/facultydashboard/FacultyProfile";
// import Navbar from "./components/commoncomponents/Navbar"
import LandingPage from "./pages/LandingPage"
import MainLayout from "./layout/MainLayout";
import SignupPage from "./components/SignupPage";
import AdminCourse from "./components/admindashboard/AdminCourse";
import AdminProfile from "./components/admindashboard/AdminProfile";
import StudentLayout from "./components/studentdashboard/StudentLayout";
import StudentDashboardContain from "./components/studentdashboard/StudentDashboardContain";
// import AdminStudents from "./components/admindashboard/AdminStudents";


function App() {
  return (



    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage/>} />
        </Route>
         <Route path="signup" element={<SignupPage/>}></Route>
        <Route path="/admindashboard" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardContain/>} />
          <Route path="student" element={<Student/>}/>
           <Route path="facultyform" element={<FacultyForm/>}/>
           <Route path="department" element={<Department/>}/>
            <Route path="course" element={<AdminCourse/>}/>
             <Route path="attendance" element={<AdminAttendance/>}/>
            <Route path="adminprofile" element={<AdminProfile/>}/>
          </Route>
       <Route path="/studentdashboard" element={<StudentLayout />}>
  <Route index element={<StudentDashboardContain />} />
  {/* <Route path="courses" element={<Courses />} />
  <Route path="attendance" element={<Attendance />} />
  <Route path="marks" element={<Marks />} />
  <Route path="assignments" element={<Assignments />} />
  <Route path="results" element={<Results />} />
  <Route path="notice" element={<Notice />} />
  <Route path="timetable" element={<Timetable />} />
  <Route path="profile" element={<StudentProfile />} /> */}
</Route>
        <Route path="/facultydashboard" element={<FacultyDashboard />}>
                  <Route index element={<FacultyDashboardContain />} />
                 <Route path="profile" element={<FacultyProfile />} />
                 {/* <Route path="courses" element={<Courses />} />
                 <Route path="timetable" element={<Timetable />} />
                 <Route path="attendance" element={<Attendance />} />
                 <Route path="marks" element={<Marks />} />
                 <Route path="assignments" element={<Assignments />} />
                 <Route path="students" element={<Students />} />  */} 
               </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;