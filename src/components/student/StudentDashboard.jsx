  import { Link } from 'react-router-dom';
  import { useNavigate } from 'react-router-dom';
  import './StudentDashboard.css'
  function StudentDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/student/login');
    };

    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className='student-dashboard'>Student Dash<span className='boards'>board</span></h1>
          <nav className="nav-menu">
            <Link to="/student/exemption" className="nav-link2">Event Registration</Link>
            <button onClick={handleLogout} className="btnstudentlogout">Logout</button>
          </nav>
        </div>
      </div>
    );
  }
  export default  StudentDashboard;