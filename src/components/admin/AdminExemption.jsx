import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './AdminExemption.css'; // rename to AdminEvent.css if needed

function AdminEventApproval() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleEvent = async (id, status) => {
    if (status === 'rejected' && !rejectionReasons[id]) {
      setMessage('Please provide a rejection reason.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/events/${id}`,
        { status, rejectionReason: status === 'rejected' ? rejectionReasons[id] : '' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessage(`Event ${status}`);
      fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
      setMessage('Error updating event');
    }
  };

  const handleRejectionReasonChange = (id, reason) => {
    setRejectionReasons({ ...rejectionReasons, [id]: reason });
  };

  return (
    <div>
      <AdminDashboard />
      <div className="table-container-excemption-request-view">
        <h2 className="exemption-request adminexemption">Event Requests</h2>
        {message && (
          <div
            className={`status-message adminexemption ${
              message.toLowerCase().includes('error') ? 'error' : 'success'
            }`}
          >
            {message}
          </div>
        )}

        <table className="excemption-request-table adminexemption">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Venue</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.eventName}</td>
                <td>{event.venueName || 'N/A'}</td>
                <td>{new Date(event.eventFrom).toLocaleDateString()}</td>
                <td>{new Date(event.eventTo).toLocaleDateString()}</td>
                <td>
                  {event.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleEvent(event._id, 'approved')}
                        className="btnapprove"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleEvent(event._id, 'rejected')}
                        className="btn reject"
                      >
                        Reject
                      </button>
                      <input
                        type="text"
                        placeholder="Enter rejection reason"
                        value={rejectionReasons[event._id] || ''}
                        onChange={(e) =>
                          handleRejectionReasonChange(event._id, e.target.value)
                        }
                        className="rejection-input"
                      />
                    </>
                  ) : (
                    <span>{event.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminEventApproval;

















// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import AdminDashboard from './AdminDashboard';
// import './AdminExemption.css';

// function AdminExemption() {
//   const [exemptions, setExemptions] = useState([]);
//   const [message, setMessage] = useState('');
//   const [rejectionReasons, setRejectionReasons] = useState({});

//   useEffect(() => {
//     fetchExemptions();
//   }, []);

//   const fetchExemptions = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/exemptions', {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });
//       setExemptions(response.data);
//     } catch (err) {
//       console.error('Error fetching exemptions:', err);
//     }
//   };

//   const handleExemption = async (id, status) => {
//     if (status === 'rejected' && !rejectionReasons[id]) {
//       setMessage('Please provide a rejection reason.');
//       return;
//     }

//     try {
//       await axios.put(
//         `http://localhost:5000/api/exemptions/${id}`,
//         { status, rejectionReason: status === 'rejected' ? rejectionReasons[id] : '' },
//         {
//           headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//         }
//       );
//       setMessage(`Exemption ${status}`);
//       fetchExemptions();
//     } catch (err) {
//       console.error('Error updating exemption:', err);
//       setMessage('Error updating exemption');
//     }
//   };

//   const handleRejectionReasonChange = (id, reason) => {
//     setRejectionReasons({ ...rejectionReasons, [id]: reason });
//   };

//   return (
//     <div>
//       <AdminDashboard />
//       <div className="table-container-excemption-request-view">
//         <h2 className='exemption-request adminexemption'>Exemption Requests</h2>
//         {message && <div className={`status-message adminexemption ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>{message}</div>}

//         {/* 📋 Exemptions Table */}
//         <table className='excemption-request-table adminexemption'>
//           <thead>
//             <tr>
//               <th className='th-name adminexemption'>Name</th>
//               <th className='th-coursesa adminexemption'>Completed Courses</th>
//               <th className='th-electivea adminexemption'>Elective Course</th>
//               <th className='th-statusa adminexemption'>Status</th>
//               <th className='th-actionsa adminexemption'>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {exemptions.map((exemption) => (
//               <tr key={exemption._id} className="adminexemption">
//                 <td className='td-name adminexemption'>{exemption.student?.username || 'N/A'}</td>
//                 <td className='td-coursesa adminexemption'>
//                   {exemption.completedCourses?.map(course => course.name).join(', ') || 'N/A'}
//                 </td>
//                 <td className='td-electivea adminexemption'>{exemption.electiveCourse || 'N/A'}</td>
//                 <td className='td-statusa adminexemption'>{exemption.status}</td>
//                 <td className='td-actionsa adminexemption'>
//                   {exemption.status === 'pending' && (
//                     <>
//                       <button 
//                         onClick={() => handleExemption(exemption._id, 'approved')}
//                         className="btnapprove adminexemption"
//                       >
//                         Approve
//                       </button>
//                       <button 
//                         onClick={() => handleExemption(exemption._id, 'rejected')}
//                         className="btn reject adminexemption"
//                       >
//                         Reject
//                       </button>
//                       <input
//                         type="text"
//                         placeholder="Enter rejection reason"
//                         value={rejectionReasons[exemption._id] || ''}
//                         onChange={(e) => handleRejectionReasonChange(exemption._id, e.target.value)}
//                         className="rejection-input adminexemption"
//                       />
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default AdminExemption;
