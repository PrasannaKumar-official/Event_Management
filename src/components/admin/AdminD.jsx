import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import './AdminD.css';

function AdminD() {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalRegistrations: 0,
    pendingRequests: 0,
    upcomingCourses: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, registrationsRes, exemptionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/courses', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/courses/registrations', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('http://localhost:5000/api/exemptions', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
  
      const courses = coursesRes.data;
      const registrations = registrationsRes.data;
      const pendingRequests = exemptionsRes.data.filter(req => req.status === 'pending').length;
  
      const upcomingCourses = courses.filter(course => new Date(course.startDate) > new Date());
  
      // Ensure valid updatedAt values and remove duplicates
      const recentActivity = [
        ...courses.filter(course => course.updatedAt).slice(-3),
        ...registrations.filter(reg => reg.updatedAt).slice(-3)
      ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
       .slice(0, 3); // Limit to only 3 most recent
  
      setDashboardData({
        totalCourses: courses.length,
        totalRegistrations: registrations.reduce((sum, course) => sum + course.students.length, 0),
        pendingRequests,
        upcomingCourses,
        recentActivity
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };
  
  return (
    <div className="admin-dashboard-adminD">
      <AdminDashboard/>
      <h2 className='DASHBOARD-ADMIN'>Dashboard</h2>
      <div className="dashboard-stats-adminD">
        <div className="stat-box-adminD">Total Courses: {dashboardData.totalCourses}</div>
        <div className="stat-box-adminD">Total Registrations: {dashboardData.totalRegistrations}</div>
        <div className="stat-box-adminD">Pending Requests: {dashboardData.pendingRequests}</div>
      </div>

      <div className="dashboard-section-adminD">
        <h3>Upcoming Courses</h3>
        <ul>
          {dashboardData.upcomingCourses.length > 0 ? dashboardData.upcomingCourses.map(course => (
            <li key={course._id}>{course.name} - Starts on {new Date(course.startDate).toLocaleDateString()}</li>
          )) : <p>No upcoming courses.</p>}
        </ul>
      </div>

      <div className="dashboard-section-adminD">
        <h3>Recent Activity</h3>
        <ul>
          {dashboardData.recentActivity.length > 0 ? dashboardData.recentActivity.map(activity => (
            <li key={activity._id}>{activity.name || 'Unknown Activity'} - Updated on {new Date(activity.updatedAt).toLocaleDateString()}</li>
          )) : <p>No recent activity.</p>}
        </ul>
      </div>
    </div>
  );
}

export default AdminD;