import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import './StudentExemption.css';

function StudentExemption() {
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [electiveCourse, setElectiveCourse] = useState('');
  const [message, setMessage] = useState('');
  const [exemptionHistory, setExemptionHistory] = useState([]);
  const [approvedCourses, setApprovedCourses] = useState(new Set());

  useEffect(() => {
    fetchExemptionHistory();
    fetchRegisteredCourses();
  }, []);

  const fetchRegisteredCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses/registered', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setRegisteredCourses(response.data);
    } catch (err) {
      console.error('Error fetching registered courses:', err);
    }
  };

  const fetchExemptionHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exemptions/history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setExemptionHistory(response.data);
      const approvedSet = new Set();
      response.data.forEach(history => {
        if (history.status === 'approved') {
          history.completedCourses.forEach(course => approvedSet.add(course._id));
        }
      });
      setApprovedCourses(approvedSet);
    } catch (err) {
      console.error('Error fetching exemption history:', err);
    }
  };

  const handleCourseSelect = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else if (selectedCourses.length < 3) {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCourses.length !== 3) {
      setMessage('Please select exactly 3 completed courses');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/exemptions/apply', {
        completedCourses: selectedCourses,
        electiveCourse
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage('Exemption request submitted successfully');
      fetchExemptionHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting exemption request');
    }
  };

  return (
    <div className="studentexemption">
      <StudentDashboard />
      
      {/* Left side: Apply for Exemption */}
      <div className="form-container-studentexemption">
        <h2 className='applyforcourseexemptions-studentexemption'>Apply for Course Exemption</h2>
        {message && <div className="status-message-studentexemption">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-studentexemption">
            <h3 className='selectthree-studentexemption'>Select 3 Registered Courses:</h3>
            <div className="course-selection-studentexemption">
              {registeredCourses.map(course => (
                !approvedCourses.has(course._id) && (
                  <div key={course._id} className="course-checkbox-studentexemption">
                    <input
                      className='coursescompletedbox-studentexemption'
                      type="checkbox"
                      id={course._id}
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => handleCourseSelect(course._id)}
                      disabled={selectedCourses.length >= 3 && !selectedCourses.includes(course._id)}
                    />
                    <label htmlFor={course._id}>{course.name}</label>
                  </div>
                )
              ))}
            </div>
          </div>
          <div className="form-group-studentexemption">
            <label className='electivecoursetoexempts-studentexemption'>Elective Course to Exempt:</label>
            <input
              type="text"
              value={electiveCourse}
              onChange={(e) => setElectiveCourse(e.target.value)}
              required
              className='electivecoursess-studentexemption'
            />
          </div>
          <button 
            type="submit" 
            className="btnss-studentexemption"
            disabled={selectedCourses.length !== 3 || !electiveCourse}
          >
            Apply for Exemption
          </button>
        </form>
      </div>

      {/* Right side: Exemption Request History */}
      <div className="form-container-studentexemption1">
        <h2 className='history-title-studentexemption'>Exemption Request History</h2>
        <table className="exemption-table-studentexemption">
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Completed Courses</th>
              <th>Elective Course (Exempted)</th>
              <th>Status</th>
              <th>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            {exemptionHistory.map((history, index) => (
              <tr key={history._id}>
                <td>{index + 1}</td>
                <td>
                  <ul>
                    {history.completedCourses.map(course => (
                      <li key={course._id}>{course.name}</li>
                    ))}
                  </ul>
                </td>
                <td>{history.electiveCourse}</td>
                <td>{history.status}</td>
                <td>{history.status === 'rejected' ? history.rejectionReason : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentExemption;
