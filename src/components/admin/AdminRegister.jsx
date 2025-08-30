import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminRegister.css';
import { Link } from 'react-router-dom';

function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (adminKey !== '123') {
      setError('Invalid Admin Key');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/admin/register', {
        username,
        password,
        role: 'admin'
      });
      navigate('/admin/login');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <>
      <h2 className='page-title-adminregister'>EVENT MANAGEMENT SYSTEM</h2>
      <div className="login-container-adminregister">
        <h2 className='AdminRegistration'>Admin Registration</h2>
        {error && <div className="status-message error-adminregister">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-adminregister">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group-adminregister">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group-adminregister">
            <label htmlFor="adminKey">Admin Key</label>
            <input
              id="adminKey"
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btnadminregister">Register</button>
        </form>
        <Link to="/admin/login" className="login-link-admin-register">Login here</Link>
      </div>
    </>
  );
}

export default AdminRegister;
