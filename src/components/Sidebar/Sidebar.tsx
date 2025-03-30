import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom'

export const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        {/* <Link to="/" className="flex items-center">
          <Globe2 className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-gray-800">LinguaLearn</span>
        </Link> */}
      </div>
      <div className="sidebar-menu">
        <Link to="/dashboard/learn" className={`menu-item ${isActive('/dashboard/learn') ? 'active' : ''}`}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Learn
        </Link>

        <Link to="/dashboard/stories" className={`menu-item ${isActive('/dashboard/stories') ? 'active' : ''}`}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Stories
        </Link>

        <Link to="/dashboard/quiz" className={`menu-item ${isActive('/dashboard/quiz') ? 'active' : ''}`}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Quiz
        </Link>

        <Link to="/dashboard/resources" className={`menu-item ${isActive('/dashboard/resources') ? 'active' : ''}`}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Resources
        </Link>

        <Link to="/dashboard/users" className={`menu-item ${isActive('/dashboard/users') ? 'active' : ''}`}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Users
        </Link>
      </div>
    </div>
  );
};

