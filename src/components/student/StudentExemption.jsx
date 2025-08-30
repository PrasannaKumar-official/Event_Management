import { useState, useEffect } from 'react';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import './StudentExemption.css';

function StudentExemption() {
  const [eventHistory, setEventHistory] = useState([]);
  const [formData, setFormData] = useState({
    eventName: '',
    eventFrom: '',
    eventTo: '',
    numberOfDays: '',
    timeFrom: '',
    timeTo: '',
    organizerName: '',
    department: '',
    mobile: '',
    participantsInternal: '',
    participantsExternal: '',
    guestCount: '',
    guestName: '',
    guestDesignation: '',
    guestOrg: '',
    vehicleRequired: 'No',
    accommodationRequired: 'No',
    venueName: '',
    audioRequired: 'No',
    photographyRequired: 'No',
    accessoriesRequired: 'No',
    financialRequired: 'No',
    rewardPoints: 'No'
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEventHistory();
  }, []);

  const fetchEventHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setEventHistory(response.data);
    } catch (err) {
      console.error('Error fetching event history:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/events',
        formData,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage('Event request submitted successfully ✅');
      setFormData({
        eventName: '',
        eventFrom: '',
        eventTo: '',
        numberOfDays: '',
        timeFrom: '',
        timeTo: '',
        organizerName: '',
        department: '',
        mobile: '',
        participantsInternal: '',
        participantsExternal: '',
        guestCount: '',
        guestName: '',
        guestDesignation: '',
        guestOrg: '',
        vehicleRequired: 'No',
        accommodationRequired: 'No',
        venueName: '',
        audioRequired: 'No',
        photographyRequired: 'No',
        accessoriesRequired: 'No',
        financialRequired: 'No',
        rewardPoints: 'No'
      });
      fetchEventHistory(); // refresh history after submitting
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting event request ❌');
    }
  };

  return (
    <div className="studentexemption">
      <StudentDashboard />

      {/* Left side: Event Form */}
      <div className="form-container-studentexemption">
        {message && <div className="status-message-studentexemption">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-studentexemption">
            <label>Name of the Event :</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="event-input"
              required
            />
          </div>

          <div className="form-group-studentexemption">
            <label>Event Date(s) :</label>
            <div>
              From: <input type="date" name="eventFrom" value={formData.eventFrom} onChange={handleChange} className="event-input" required />  
              To: <input type="date" name="eventTo" value={formData.eventTo} onChange={handleChange} className="event-input" required />
            </div>
          </div>

          <div className="form-group-studentexemption">
            <label>Number of Days :</label>
            <input type="number" name="numberOfDays" value={formData.numberOfDays} onChange={handleChange} className="event-input" required />
          </div>

          <div className="form-group-studentexemption">
            <label>Event Time :</label>
            <div>
              From: <input type="time" name="timeFrom" value={formData.timeFrom} onChange={handleChange} className="event-input" required />  
              To: <input type="time" name="timeTo" value={formData.timeTo} onChange={handleChange} className="event-input" required />
            </div>
          </div>

          <h3>Event Organizer Details</h3>
          <div className="form-group-studentexemption">
            <label>Name :</label>
            <input type="text" name="organizerName" value={formData.organizerName} onChange={handleChange} className="event-input" required />
          </div>
          <div className="form-group-studentexemption">
            <label>Department :</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} className="event-input" required />
          </div>
          <div className="form-group-studentexemption">
            <label>Mobile Number :</label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="event-input" required />
          </div>

          <h3>No. of Participants Expected</h3>
          <div className="form-group-studentexemption">
            <label>Internal :</label>
            <input type="number" name="participantsInternal" value={formData.participantsInternal} onChange={handleChange} className="event-input" />
          </div>
          <div className="form-group-studentexemption">
            <label>External :</label>
            <input type="number" name="participantsExternal" value={formData.participantsExternal} onChange={handleChange} className="event-input" />
          </div>

          <h3>Guest Details</h3>
          <div className="form-group-studentexemption">
            <label>No. of Guest :</label>
            <input type="number" name="guestCount" value={formData.guestCount} onChange={handleChange} className="event-input" />
          </div>
          <div className="form-group-studentexemption">
            <label>Name of the Guest :</label>
            <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} className="event-input" />
          </div>
          <div className="form-group-studentexemption">
            <label>Designation :</label>
            <input type="text" name="guestDesignation" value={formData.guestDesignation} onChange={handleChange} className="event-input" />
          </div>
          <div className="form-group-studentexemption">
            <label>Name of the Organization / Industry :</label>
            <input type="text" name="guestOrg" value={formData.guestOrg} onChange={handleChange} className="event-input" />
          </div>

          <h3>Event Requirements</h3>
          <div className="form-group-studentexemption">
            <label>Venue Name :</label>
            <input
              type="text"
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              className="event-input"
              required
            />
          </div>

          {[
            { key: 'vehicleRequired', label: 'Vehicle Required*' },
            { key: 'accommodationRequired', label: 'Accommodation Required*' },
            { key: 'audioRequired', label: 'Audio Required*' },
            { key: 'photographyRequired', label: 'Photography Required*' },
            { key: 'accessoriesRequired', label: 'Accessories Required*' },
            { key: 'financialRequired', label: 'Financial Required*' },
            { key: 'rewardPoints', label: 'Reward Points*' },
          ].map(item => (
            <div className="form-group-studentexemption" key={item.key}>
              <label>{item.label} :</label>
              <select
                name={item.key}
                value={formData[item.key]}
                onChange={handleChange}
                className="event-input"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          ))}

          <button type="submit" className="btnss-studentexemption">Submit Event Request</button>
        </form>
      </div>

      {/* Right side: Event Request History */}
      <div className="form-container-studentexemption1">
        <h2 className="history-title-studentexemption">Event Request History</h2>
        <table className="exemption-table-studentexemption">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Organizer</th>
              <th>Department</th>
              <th>Venue</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Rejection Reason</th>
            </tr>
          </thead>
          <tbody>
            {eventHistory.length > 0 ? (
              eventHistory.map(event => (
                <tr key={event._id}>
                  <td>{event.eventName}</td>
                  <td>{event.organizerName}</td>
                  <td>{event.department}</td>
                  <td>{event.venueName}</td>
                  <td>{new Date(event.eventFrom).toLocaleDateString()}</td>
                  <td>{new Date(event.eventTo).toLocaleDateString()}</td>
                  <td>{event.status || 'pending'}</td>

                  <td>{event.status === 'rejected' ? event.rejectionReason : 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No event requests yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentExemption;








// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import StudentDashboard from './StudentDashboard';
// import './StudentExemption.css';

// function StudentExemption() {
//   const [registeredCourses, setRegisteredCourses] = useState([]);
//   const [selectedCourses, setSelectedCourses] = useState([]);
//   const [electiveCourse, setElectiveCourse] = useState('');
//   const [message, setMessage] = useState('');
//   const [exemptionHistory, setExemptionHistory] = useState([]);
//   const [approvedCourses, setApprovedCourses] = useState(new Set());

//   useEffect(() => {
//     fetchExemptionHistory();
//     fetchRegisteredCourses();
//   }, []);

//   const fetchRegisteredCourses = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/courses/registered', {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });
//       setRegisteredCourses(response.data);
//     } catch (err) {
//       console.error('Error fetching registered courses:', err);
//     }
//   };

//   const fetchExemptionHistory = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/exemptions/history', {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });
//       setExemptionHistory(response.data);
//       const approvedSet = new Set();
//       response.data.forEach(history => {
//         if (history.status === 'approved') {
//           history.completedCourses.forEach(course => approvedSet.add(course._id));
//         }
//       });
//       setApprovedCourses(approvedSet);
//     } catch (err) {
//       console.error('Error fetching exemption history:', err);
//     }
//   };

//   const handleCourseSelect = (courseId) => {
//     if (selectedCourses.includes(courseId)) {
//       setSelectedCourses(selectedCourses.filter(id => id !== courseId));
//     } else if (selectedCourses.length < 3) {
//       setSelectedCourses([...selectedCourses, courseId]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (selectedCourses.length !== 3) {
//       setMessage('Please select exactly 3 completed courses');
//       return;
//     }
//     try {
//       await axios.post('http://localhost:5000/api/exemptions/apply', {
//         completedCourses: selectedCourses,
//         electiveCourse
//       }, {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });
//       setMessage('Exemption request submitted successfully');
//       fetchExemptionHistory();
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Error submitting exemption request');
//     }
//   };

//   return (
//     <div className="studentexemption">
//       <StudentDashboard />
      
//       {/* Left side: Apply for Exemption */}
//       <div className="form-container-studentexemption">
//         <h2 className='applyforcourseexemptions-studentexemption'>Apply for Course Exemption</h2>
//         {message && <div className="status-message-studentexemption">{message}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group-studentexemption">
//             <h3 className='selectthree-studentexemption'>Select 3 Registered Courses:</h3>
//             <div className="course-selection-studentexemption">
//               {registeredCourses.map(course => (
//                 !approvedCourses.has(course._id) && (
//                   <div key={course._id} className="course-checkbox-studentexemption">
//                     <input
//                       className='coursescompletedbox-studentexemption'
//                       type="checkbox"
//                       id={course._id}
//                       checked={selectedCourses.includes(course._id)}
//                       onChange={() => handleCourseSelect(course._id)}
//                       disabled={selectedCourses.length >= 3 && !selectedCourses.includes(course._id)}
//                     />
//                     <label htmlFor={course._id}>{course.name}</label>
//                   </div>
//                 )
//               ))}
//             </div>
//           </div>
//           <div className="form-group-studentexemption">
//             <label className='electivecoursetoexempts-studentexemption'>Elective Course to Exempt:</label>
//             <input
//               type="text"
//               value={electiveCourse}
//               onChange={(e) => setElectiveCourse(e.target.value)}
//               required
//               className='electivecoursess-studentexemption'
//             />
//           </div>
//           <button 
//             type="submit" 
//             className="btnss-studentexemption"
//             disabled={selectedCourses.length !== 3 || !electiveCourse}
//           >
//             Apply for Exemption
//           </button>
//         </form>
//       </div>

//       {/* Right side: Exemption Request History */}
//       <div className="form-container-studentexemption1">
//         <h2 className='history-title-studentexemption'>Exemption Request History</h2>
//         <table className="exemption-table-studentexemption">
//           <thead>
//             <tr>
//               <th>Serial No</th>
//               <th>Completed Courses</th>
//               <th>Elective Course (Exempted)</th>
//               <th>Status</th>
//               <th>Rejection Reason</th>
//             </tr>
//           </thead>
//           <tbody>
//             {exemptionHistory.map((history, index) => (
//               <tr key={history._id}>
//                 <td>{index + 1}</td>
//                 <td>
//                   <ul>
//                     {history.completedCourses.map(course => (
//                       <li key={course._id}>{course.name}</li>
//                     ))}
//                   </ul>
//                 </td>
//                 <td>{history.electiveCourse}</td>
//                 <td>{history.status}</td>
//                 <td>{history.status === 'rejected' ? history.rejectionReason : 'N/A'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default StudentExemption;
