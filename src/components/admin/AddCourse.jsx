import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import './AddCourse.css';

function AddCourse() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [lastRegistrationDate, setLastRegistrationDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxCount, setMaxCount] = useState(''); // New state for max count
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let formattedLastRegistrationDate = lastRegistrationDate ? lastRegistrationDate.replace("T", " ") : '';
    const formattedStartDate = startDate ? startDate.split('T')[0] : '';
    const formattedEndDate = endDate ? endDate.split('T')[0] : '';

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('lastRegistrationDate', formattedLastRegistrationDate);
    formData.append('startDate', formattedStartDate);
    formData.append('endDate', formattedEndDate);
    formData.append('maxCount', maxCount); // Add maxCount

    try {
      await axios.post('http://localhost:5000/api/courses/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Course added successfully');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      console.error('Error response:', err.response);
      setMessage('Error adding course');
    }
  };

  return (
    <>
      <AdminDashboard />
      <div className="form-container-addcourse">
        <h2 className="title-addcourse">Add New Course</h2>
        {message && <div className="status-message-addcourse success">{message}</div>}
        <form className='admin-addcourse-form' onSubmit={handleSubmit}>
          <div className="form-group-addcourse">
            <label className="label-addcourse">Course Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="textbox-addcourse" />
          </div>
          
          <div className="form-group-addcourse">
            <label className="label-addcourse">Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="textbox-addcourse large-addcourse" />
          </div>

          <div className="form-group-addcourse">
            <label className="label-addcourse">Course Image:</label>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="file-input-addcourse" required />
          </div>

          <div className="form-group-addcourse">
            <label className="label-addcourse">Last Registration Date:</label>
            <input type="datetime-local" value={lastRegistrationDate} onChange={(e) => setLastRegistrationDate(e.target.value)} required className="textbox-addcourse" />
          </div>

          <div className="form-group-addcourse">
            <label className="label-addcourse">Course Start Date:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="textbox-addcourse" />
          </div>

          <div className="form-group-addcourse">
            <label className="label-addcourse">Course End Date:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="textbox-addcourse" />
          </div>

          <div className="form-group-addcourse">
            <label className="label-addcourse">Maximum Students:</label>
            <input type="number" value={maxCount} onChange={(e) => setMaxCount(e.target.value)} required className="textbox-addcourse" />
          </div>

          <button type="submit" className="btn-submit-addcourse">Add Course</button>
        </form>
      </div>
    </>
  );
}

export default AddCourse;
