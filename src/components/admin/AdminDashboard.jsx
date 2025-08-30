import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <>
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2 className='Admin-Dashboard'>Admin Dash<span className='board'>board</span></h2>
        <nav className="nav-menu-admin">
          <Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active" : ""}>Dashboard</Link>
          <Link to="/admin/exemptions" className={location.pathname === "/admin/exemptions" ? "active" : ""}>Event Requests</Link>

        </nav>
        <button onClick={handleLogout} className="adminlogout">Logout</button>
      </div>
    </>
  );
}

export default AdminDashboard;
