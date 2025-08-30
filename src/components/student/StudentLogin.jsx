import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentLogin.css'; 
import { Link } from 'react-router-dom';

function StudentLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/auth/student/login', {
      username,
      password
    });

    console.log('🔵 Login Response:', response.data); // Debugging line

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('✅ Token stored:', localStorage.getItem('token'));
      navigate('/student/exemption');
    } else {
      console.error('❌ Token missing in response:', response.data);
    }
  } catch (err) {
    console.error('❌ Login Error:', err.response?.data || err);
    setError('Invalid credentials');
  }
};


  return (
    <>
    <h2 className='one-Credit-Course-Exemption-System-for-login-student'>EVENT MANAGEMENT SYSTEM</h2>
    <div className="login-container-studentlogin">
      <h2 className="StudentLogin">User Login</h2>
      {error && <div className="status-message error-studentlogin">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group-studentlogin">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group-studentlogin">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btnstudentlogin">Login</button>
      </form>
      <Link to="/student/register" className="login-link-student-login">Register here</Link>
      <Link to="/admin/login" className="login-link-student-foradmin">Admin page</Link>
    </div>
    </>
  );
}
export default StudentLogin;
