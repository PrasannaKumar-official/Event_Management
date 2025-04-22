import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import './AvailableCourses.css';

function AvailableCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async ()=>{
    try {
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      console.log('Courses from backend:', response.data);

      const sortedCourses = response.data
        .map(course => ({
          ...course,
          currentCount: course.currentCount || 0,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setCourses(sortedCourses);
      setFilteredCourses(sortedCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleFilterChange = newFilter => {
    setFilter(newFilter);
  
    let updatedCourses = [...courses];
  
    if (newFilter === 'available') {
      updatedCourses = updatedCourses.filter(
        course => new Date(course.lastRegistrationDate) >= new Date()
      );
    } else if (newFilter === 'open') {
      updatedCourses = updatedCourses.filter(
        course =>
          course.currentCount < course.maxCount && 
          new Date(course.endDate) >= new Date() && // Exclude ended courses
          new Date(course.lastRegistrationDate) >= new Date() // Exclude past registration deadlines
      );
    }
  
    setFilteredCourses(updatedCourses);
  };
  

  const handleRegister = async courseId => {
    if (!name || !rollNumber || !department || !year) return;

    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/register`,
        { name, rollNumber, department, year },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setMessage('Successfully registered for the course');
      fetchCourses();
      closeModal();
    } catch (err) {
      setMessage('Error registering for course');
    }
  };

  const openModal = course => setSelectedCourse(course);
  const closeModal = () => {
    setSelectedCourse(null);
    setName('');
    setRollNumber('');
    setDepartment('');
    setYear('');
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="available-courses coursesavailable">
      <StudentDashboard />

      <nav className="course-nav">
        <button
          onClick={() => handleFilterChange('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          All Courses
        </button>
        <button
          onClick={() => handleFilterChange('available')}
          className={filter === 'available' ? 'active' : ''}
        >
          Currently Available
        </button>
        <button
          onClick={() => handleFilterChange('open')}
          className={filter === 'open' ? 'active' : ''}
        >
          Open for Registration
        </button>
      </nav>

      {message && <div className="status-message success coursesavailable">{message}</div>}

      <div className="course-grid-wrapper">
  <div className="course-grid coursesavailable">
    {filteredCourses.map(course => (
      <div key={course._id} className="course-card coursesavailable">
        <img
          src={`http://localhost:5000/${course.image}`}
          alt={course.name}
          className="course-image coursesavailable"
        />
        <h3 className="course-name coursesavailable">{course.name}</h3>
        <p className="registration-info coursesavailable">
          Registered: {course.currentCount} / {course.maxCount}
        </p>
        <button
          onClick={() => openModal(course)}
          className="btn view-btn coursesavailable"
        >
          View
        </button>
      </div>
    ))}
  </div>
</div>


      {selectedCourse && (
        <div className="modal-overlay coursesavailable">
          <div className="modal-content coursesavailable">
            <h2 className="coursesavailable">{selectedCourse.name}</h2>
            <p className="course-description coursesavailable">{selectedCourse.description}</p>
            <p>
              <strong>Last Registration Date:</strong> {formatDate(selectedCourse.lastRegistrationDate)}
            </p>
            <p>
              <strong>Start Date:</strong> {formatDate(selectedCourse.startDate)}
            </p>
            <p>
              <strong>End Date:</strong> {formatDate(selectedCourse.endDate)}
            </p>

            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field coursesavailable"
            />
            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNumber}
              onChange={e => setRollNumber(e.target.value)}
              className="input-field coursesavailable"
            />

            <select value={department} onChange={e => setDepartment(e.target.value)} className="input-field coursesavailable">
              <option value="">Select Department</option>
              <option value="Computer Science Engineering">Computer Science Engineering</option>
              <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>

            <select value={year} onChange={e => setYear(e.target.value)} className="input-field coursesavailable">
              <option value="">Select Year</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>

            <button
              onClick={() => handleRegister(selectedCourse._id)}
              className="btn register-btn coursesavailable"
              disabled={
                !name || !rollNumber || !department || !year ||
                selectedCourse.isRegistered ||
                selectedCourse.currentCount >= selectedCourse.maxCount
              }
            >
              {selectedCourse.currentCount >= selectedCourse.maxCount
                ? 'Full'
                : selectedCourse.isRegistered
                ? 'Registered'
                : 'Register'}
            </button>

            <button onClick={closeModal} className="btn close-btn coursesavailable">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailableCourses;
