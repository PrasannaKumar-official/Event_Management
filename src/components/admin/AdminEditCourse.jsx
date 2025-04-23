import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import './AdminEditCourse.css';

function EditCourse() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then((res) => setCourses(res.data))
    .catch((err) => console.error('Error fetching courses:', err));
  }, []);

  const handleEditClick = (course) => {
    setSelectedCourse({
      ...course,
      image: null, // Reset image selection
    });
    setPreview(course.image ? `http://localhost:5000/${course.image}` : null);
  };

  const handleChange = (e) => {
    setSelectedCourse({ ...selectedCourse, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedCourse({ ...selectedCourse, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      const formData = new FormData();
      Object.entries(selectedCourse).forEach(([key, value]) => {
        if (key !== 'image' || (key === 'image' && value)) formData.append(key, value);
      });

      await axios.put(`http://localhost:5000/api/courses/update/${selectedCourse._id}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});


      setMessage('Course updated successfully');
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setMessage('Error updating course');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}/delete`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCourses(courses.filter(course => course._id !== id));
      setMessage('Course deleted successfully');
    } catch (err) {
      setMessage('Error deleting course');
    }
  };

  return (
    <div className="editcourse">
      <AdminDashboard />
      <h2 className="heading-editcourse">All Courses</h2>
      {message && <div className="status-message-editcourse">{message}</div>}
      <table className="table-editcourse">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Max Students</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id} className="row-editcourse">
              <td>{course.name}</td>
              <td>{new Date(course.startDate).toLocaleDateString()}</td>
              <td>{new Date(course.endDate).toLocaleDateString()}</td>
              <td>{course.maxCount}</td>
              <td>
                <button className="edit-btn-editcourse" onClick={() => handleEditClick(course)}>Edit</button>
                <button className="delete-btn-editcourse" onClick={() => handleDelete(course._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCourse && (
        <div className="form-container-editcourse">
          <h2 className="form-heading-editcourse">Edit Course</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-editcourse">
            <label className="label-editcourse">Course Name:</label>
            <input className="input-editcourse" type="text" name="name" value={selectedCourse.name} onChange={handleChange} required />

            <label className="label-editcourse">Description:</label>
            <textarea className="textarea-editcourse" name="description" value={selectedCourse.description} onChange={handleChange} required />

            <label className="label-editcourse">Last Registration Date:</label>
            <input className="input-editcourse" type="datetime-local" name="lastRegistrationDate" value={selectedCourse.lastRegistrationDate} onChange={handleChange} required />

            <label className="label-editcourse">Start Date:</label>
            <input className="input-editcourse" type="date" name="startDate" value={selectedCourse.startDate} onChange={handleChange} required />

            <label className="label-editcourse">End Date:</label>
            <input className="input-editcourse" type="date" name="endDate" value={selectedCourse.endDate} onChange={handleChange} required />

            <label className="label-editcourse">Maximum Students:</label>
            <input className="input-editcourse" type="number" name="maxCount" value={selectedCourse.maxCount} onChange={handleChange} required />

            <label className="label-editcourse">Course Image:</label>
            <input className="file-input-editcourse" type="file" accept="image/*" onChange={handleImageChange} />

            {preview && <img className="preview-img-editcourse" src={preview} alt="Course Preview" style={{ width: '100px', marginTop: '10px' }} />}

            <button className="submit-btn-editcourse" type="submit">Update Course</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditCourse;