import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentRegister.css';
import { Link } from 'react-router-dom';

function StudentRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/student/register', {
        username,
        password,
        role: 'student'
      });
      navigate('/student/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (<>
  <h2 className='one-Credit-Course-Exemption-System-for-register-student'>EVENT MANAGEMENT SYSTEM</h2>
    <div className="login-container-studentregister">
      <h2 className="StudentRegistration">User Registration</h2>
      {error && <div className="status-message error-studentregister">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group-studentregister">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            
          />
        </div>
        <div className="form-group-studentregister">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        
          />
        </div>
        <button type="submit" className="btnstudentregister">Register</button>
      </form>
      <Link to="/student/login" className="login-link-student-register">Login here</Link>
    </div></>
  );
}

export default StudentRegister;
