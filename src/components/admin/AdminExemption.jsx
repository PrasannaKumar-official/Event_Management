import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './AdminExemption.css';

function AdminExemption() {
  const [exemptions, setExemptions] = useState([]);
  const [message, setMessage] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [filters, setFilters] = useState({
    rollNumber: '',
    year: '',
    department: '',
  });

  useEffect(() => {
    fetchExemptions();
  }, []);

  const fetchExemptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exemptions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      console.log("Fetched Exemptions:", response.data);
      setExemptions(response.data);
    } catch (err) {
      console.error('Error fetching exemptions:', err);
    }
  };

  const handleExemption = async (id, status) => {
    if (status === 'rejected' && !rejectionReasons[id]) {
      setMessage('Please provide a rejection reason.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/exemptions/${id}`,
        { status, rejectionReason: status === 'rejected' ? rejectionReasons[id] : '' },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setMessage(`Exemption ${status}`);
      fetchExemptions();
    } catch (err) {
      console.error('Error updating exemption:', err);
      setMessage('Error updating exemption');
    }
  };

  const handleRejectionReasonChange = (id, reason) => {
    setRejectionReasons({ ...rejectionReasons, [id]: reason });
  };

  const filteredExemptions = exemptions.filter(exemption => {
    console.log("Filtering Exemption:", exemption);
    if (!exemption.student){
      console.warn("Missing student data for exemption:", exemption);
      return false;
    }
    return (
      (filters.rollNumber.trim() === '' || exemption.student.rollNumber?.toLowerCase().includes(filters.rollNumber.toLowerCase())) &&
      (filters.year.trim() === '' || String(exemption.student.year) === filters.year.trim()) &&
      (filters.department.trim() === '' || exemption.student.department?.toLowerCase().includes(filters.department.toLowerCase()))
    );
  });

  return (
    <div>
      <AdminDashboard />
      <div className="table-container-excemption-request-view ">
        <h2 className='exemption-request adminexemption'>Exemption Requests</h2>
        {message && <div className={`status-message adminexemption ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>{message}</div>}

        {/* 🔍 Filter Inputs */}
        <div className="filter-container adminexemption">
          <input
            type="text"
            placeholder="Filter by Roll Number"
            value={filters.rollNumber}
            onChange={(e) => setFilters({ ...filters, rollNumber: e.target.value })}
            className="filter-input adminexemption"
          />
          <input
            type="text"
            placeholder="Filter by Year"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="filter-input adminexemption"
          />
          <input
            type="text"
            placeholder="Filter by Department"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="filter-input adminexemption"
          />
        </div>

        {/* 📋 Exemptions Table */}
        <table className='excemption-request-table adminexemption'>
          <thead>
            <tr>
              <th className='th-name adminexemption'>Name</th>
              <th className='th-rollnumber adminexemption'>Roll Number</th>
              <th className='th-year adminexemption'>Year</th>
              <th className='th-department adminexemption'>Department</th>
              <th className='th-coursesa adminexemption'>Completed Courses</th>
              <th className='th-electivea adminexemption'>Elective Course</th>
              <th className='th-statusa adminexemption'>Status</th>
              <th className='th-actionsa adminexemption'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExemptions.map((exemption) => (
              <tr key={exemption._id} className="adminexemption">
                <td className='td-name adminexemption'>{exemption.student?.username || 'N/A'}</td>
                <td className='td-rollnumber adminexemption'>{exemption.student?.rollNumber || 'N/A'}</td>
                <td className='td-year adminexemption'>{exemption.student?.year || 'N/A'}</td>
                <td className='td-department adminexemption'>{exemption.student?.department || 'N/A'}</td>
                <td className='td-coursesa adminexemption'>{exemption.completedCourses?.map(c => c.name).join(', ') || 'N/A'}</td>
                <td className='td-electivea adminexemption'>{exemption.electiveCourse || 'N/A'}</td>
                <td className='td-statusa adminexemption'>{exemption.status}</td>
                <td className='td-actionsa adminexemption'>
                  {exemption.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleExemption(exemption._id, 'approved')}
                        className="btnapprove adminexemption"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleExemption(exemption._id, 'rejected')}
                        className="btn reject adminexemption"
                      >
                        Reject
                      </button>
                      <input
                        type="text"
                        placeholder="Enter rejection reason"
                        value={rejectionReasons[exemption._id] || ''}
                        onChange={(e) => handleRejectionReasonChange(exemption._id, e.target.value)}
                        className="rejection-input adminexemption"
                      />
                    </>
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

export default AdminExemption;