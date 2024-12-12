import React from 'react';
import { useNavigate } from 'react-router-dom';  // Updated hook for navigation
import './css/Menu.css';

const Menu = ({ userRole }) => {
  const navigate = useNavigate();  // Use navigate hook for navigation

  // Logout handler
  const handleLogout = (e) => {
    // Prevent the default link behavior (avoid page reload)
    e.preventDefault();

    // Clear session data
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("role");

    // Redirect to the login page
    navigate('/login');  // Redirect to login page using navigate
  };

  return (
    <div className="menu">
      <ul className="menu-list">
        <li className="menu-item">
          <a href="/dashboard" className="menu-link">Dashboard {userRole}</a>
        </li>

        {/* Conditional menu items based on user role */}
        {userRole === 'Author' && (
          <>
            <li className="menu-item"><a href="/journal-submission" className="menu-link">Journal Submissions</a></li>
            {/* <li className="menu-item"><a href="/revised-papers" className="menu-link">Revised Papers</a></li> */}
            <li className="menu-item"><a href="/journal-details" className="menu-link">Paper Details</a></li>
            <li className="menu-item"><a href="/profile" className="menu-link">Profile</a></li>            
          </>
        )}

        {userRole === 'Editor' && (
          <>
            {/* <li className="menu-item"><a href="/journal-submission" className="menu-link">Manage Submissions</a></li> */}
            <li className="menu-item"><a href="/journal-details" className="menu-link">Review Feedback</a></li>
            <li className="menu-item"><a href="/profile" className="menu-link">Profile</a></li>
          </>
        )}

        {userRole === 'Reviewer' && (
          <>
            <li className="menu-item"><a href="/journal-details" className="menu-link">Review Papers</a></li>
            <li className="menu-item"><a href="/profile" className="menu-link">Profile</a></li>
          </>
        )}

        {/* Logout menu item */}
        <li className="menu-item">
          <a href="#" onClick={handleLogout} className="logout-link">Logout</a>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
