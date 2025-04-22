import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './CourseRegistration.css';

function CourseRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    course: '',
    name: '',
    rollNumber: '',
    department: '',
    year: ''
  });

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses/registrations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRegistrations(response.data);
      setFilteredRegistrations(response.data);
      setCourses(response.data.map(course => course.name));
    } catch (err) {
      setError('Error fetching registrations');
      console.error('Error:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    applyFilters({ ...filters, [name]: value });
  };

  const applyFilters = (newFilters) => {
    let filtered = registrations;
    if (newFilters.course) {
      filtered = filtered.filter(course => course.name === newFilters.course);
    }
    filtered = filtered.map(course => ({
      ...course,
      students: course.students.filter(student =>
        (newFilters.name ? student.username.toLowerCase().includes(newFilters.name.toLowerCase()) : true) &&
        (newFilters.rollNumber ? student.rollNumber.includes(newFilters.rollNumber) : true) &&
        (newFilters.department ? student.department === newFilters.department : true) &&
        (newFilters.year ? student.year === newFilters.year : true)
      )
    })).filter(course => course.students.length > 0);
    setFilteredRegistrations(filtered);
  };

  return (
    <div>
      <AdminDashboard />
      <nav className="navbar-courseregistrationadmin">
        <select name="course" onChange={handleFilterChange} className="dropdown-courseregistrationadmin">
          <option value="">All Courses</option>
          {courses.map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>
        <input type="text" name="name" placeholder="Search by Name" onChange={handleFilterChange} className="searchbox-courseregistrationadmin" />
        <input type="text" name="rollNumber" placeholder="Search by Roll Number" onChange={handleFilterChange} className="searchbox-courseregistrationadmin" />
        <select name="department" onChange={handleFilterChange} className="dropdown-courseregistrationadmin">
          <option value="">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
        </select>
        <select name="year" onChange={handleFilterChange} className="dropdown-courseregistrationadmin">
          <option value="">All Years</option>
          <option value="I">I</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
        </select>
      </nav>
      <div className="table-container-courseregisterview-courseregistrationadmin">
        <h2 className='viewcourseregister-courseregistrationadmin'>Course Registrations</h2>
        {error && <div className="status-message error-courseregistrationadmin">{error}</div>}
        <table className="course-registrations-table-courseregistrationadmin">
          <thead>
            <tr>
              <th>S.No</th> {/* Serial Number Column */}
              <th>Course Name</th>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
  {filteredRegistrations.reduce((acc, course) => {
    course.students.forEach((student) => {
      acc.push({ courseName: course.name, ...student });
    });
    return acc;
  }, []).map((entry, index) => (
    <tr key={`${entry.rollNumber}-${index}`}>
      <td>{index + 1}</td> {/* Correct Serial Numbering */}
      <td>{entry.courseName}</td>
      <td>{entry.username}</td>
      <td>{entry.rollNumber}</td>
      <td>{entry.department}</td>
      <td>{entry.year}</td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}

export default CourseRegistrations;
