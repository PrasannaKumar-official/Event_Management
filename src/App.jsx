import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AddCourse from './components/admin/AddCourse';
import CourseRegistrations from './components/admin/CourseRegistrations';
import AdminExemption from './components/admin/AdminExemption';
import StudentLogin from './components/student/StudentLogin';
import StudentDashboard from './components/student/StudentDashboard';
import AvailableCourses from './components/student/AvailableCourses';
import StudentExemption from './components/student/StudentExemption';
import StudentRegister from './components/student/StudentRegister';
import AdminRegister from './components/admin/AdminRegister';
import EditCourse from './components/admin/AdminEditCourse';
import AdminD from './components/admin/AdminD'
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/add-course" element={<AddCourse />} />
          <Route path="/admin/registrations" element={<CourseRegistrations />} />
          <Route path="/admin/exemptions" element={<AdminExemption />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/edit" element={<EditCourse />} />
          <Route path="/admin/dashboard" element={<AdminD />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<AvailableCourses />} />
          <Route path="/student/exemption" element={<StudentExemption />} />
          <Route path="/student/register" element={<StudentRegister />} />
          
          {/* Default Route */}
          <Route path="/" element={<StudentLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;