import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './AdminD.css';

function AdminD() {
  const [dashboardData, setDashboardData] = useState({
    totalRequests: 0,
    pendingEvents: 0,
    approvedEvents: 0,
    approvedEventList: []
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await axios.get('http://localhost:5000/api/events', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const events = eventsRes.data;

      const totalRequests = events.length;
      const pendingEvents = events.filter(e => e.status === 'pending').length;
      const approvedEvents = events.filter(e => e.status === 'approved').length;
      const approvedEventList = events.filter(e => e.status === 'approved');

      setDashboardData({
        totalRequests,
        pendingEvents,
        approvedEvents,
        approvedEventList
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const handleView = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  return (
    <div className="admin-dashboard-adminD">
      <AdminDashboard/>
      <h2 className='DASHBOARD-ADMIN'>Dashboard</h2>

      {/* Stats */}
      <div className="dashboard-stats-adminD">
        <div className="stat-box-adminD">Total Event Requests: {dashboardData.totalRequests}</div>
        <div className="stat-box-adminD">Pending Events: {dashboardData.pendingEvents}</div>
        <div className="stat-box-adminD">Approved Events: {dashboardData.approvedEvents}</div>
      </div>

      {/* Approved Events Table */}
      <div className="dashboard-section-adminD">
        <h3>Approved Events</h3>
        {dashboardData.approvedEventList.length > 0 ? (
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Venue</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.approvedEventList.map(event => (
                <tr key={event._id}>
                  <td>{event.eventName}</td>
                  <td>{event.venueName}</td>
                  <td>{new Date(event.eventFrom).toLocaleDateString()}</td>
                  <td>{new Date(event.eventTo).toLocaleDateString()}</td>
                  <td>
                    <button className="view-btn" onClick={() => handleView(event)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No approved events yet.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedEvent.eventName}</h3>
            <p><strong>Organizer:</strong> {selectedEvent.organizerName}</p>
            <p><strong>Department:</strong> {selectedEvent.department}</p>
            <p><strong>Mobile:</strong> {selectedEvent.mobile}</p>
            <p><strong>From:</strong> {new Date(selectedEvent.eventFrom).toLocaleString()}</p>
            <p><strong>To:</strong> {new Date(selectedEvent.eventTo).toLocaleString()}</p>
            <p><strong>Guest:</strong> {selectedEvent.guestName} ({selectedEvent.guestDesignation}, {selectedEvent.guestOrg})</p>
            <p><strong>Participants:</strong> Internal - {selectedEvent.participantsInternal}, External - {selectedEvent.participantsExternal}</p>
            <p><strong>Venue:</strong> {selectedEvent.venueName}</p>
            <p><strong>Vehicle Required:</strong> {selectedEvent.vehicleRequired ? 'Yes' : 'No'}</p>
            <p><strong>Accommodation:</strong> {selectedEvent.accommodationRequired ? 'Yes' : 'No'}</p>
            <p><strong>Audio:</strong> {selectedEvent.audioRequired ? 'Yes' : 'No'}</p>
            <p><strong>Photography:</strong> {selectedEvent.photographyRequired ? 'Yes' : 'No'}</p>
            <p><strong>Accessories:</strong> {selectedEvent.accessoriesRequired ? 'Yes' : 'No'}</p>
            <p><strong>Financial:</strong> {selectedEvent.financialRequired ? 'Yes' : 'No'}</p>
            <p><strong>Reward Points:</strong> {selectedEvent.rewardPoints}</p>

            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminD;
