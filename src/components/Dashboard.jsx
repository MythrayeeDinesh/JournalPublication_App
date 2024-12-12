import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';  // Import the Menu component
import './css/Menu.css';
import './css/Dashboard.css'; // Added a new CSS file for custom styling

const Dashboard = () => {
  const [role, setRole] = useState('');  // State to store the user's role
  const [userId, setUserId] = useState('');  // State to store the user's ID
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the role and user ID from sessionStorage (assuming it's stored during login)
    const userRole = sessionStorage.getItem('role');
    const userId = sessionStorage.getItem('user_id');

    if (userRole && userId) {
      setRole(userRole);
      setUserId(userId);
    } else {
      navigate('/login');  // Redirect to login if no user role or ID found
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      {/* Menu on the left */}
      <Menu userRole={role} />

      {/* Dashboard content on the right */}
      <div className="dashboard-content" style={{ marginLeft: '250px', padding: '20px' }}>
        <h2>Welcome to the Dashboard</h2>
        <p>Your User ID: <strong>{userId}</strong></p>

        {/* Conditional content based on user role */}
        {role === 'Author' && (
          <>
            <div className="dashboard-section author-section">
              <h3>Author Dashboard</h3>
              <p>As an Author, your primary responsibility is to contribute research work and articles to the journal.</p>

              <div className="dashboard-cards">
                <div className="card">
                  <h4>Manuscript Submission</h4>
                  <p>Submit your manuscripts in the correct format and meet submission deadlines.</p>
                  Submit a New Manuscript
                </div>
                <div className="card">
                  <h4>Track Status</h4>
                  <p>Keep an eye on the progress of your submitted manuscripts.</p>
                  Track Manuscript Status
                </div>
                <div className="card">
                  <h4>Guidelines</h4>
                  <p>Review the author guidelines to ensure compliance with journal standards.</p>
                  View Author Guidelines
                </div>
              </div>

              <h4>Your Responsibilities:</h4>
              <ul>
                <li><strong>Revisions:</strong> Respond to reviewer feedback promptly and update your manuscripts accordingly.</li>
                <li><strong>Plagiarism Check:</strong> Ensure your submissions are original and free from plagiarism.</li>
              </ul>
            </div>
          </>
        )}

        {role === 'Editor' && (
          <>
            <div className="dashboard-section editor-section">
              <h3>Editor Dashboard</h3>
              <p>As an Editor, your primary responsibility is to oversee the publication process, ensuring quality and adherence to journal standards.</p>

              <div className="dashboard-cards">
                <div className="card">
                  <h4>Review Submissions</h4>
                  <p>Evaluate submissions and ensure timely feedback to authors and reviewers.</p>
                  Review Submissions
                </div>
                <div className="card">
                  <h4>Assign Reviewers</h4>
                  <p>Select and assign reviewers for new submissions.</p>
                  Assign Reviewers
                </div>
                <div className="card">
                  <h4>Editor Guidelines</h4>
                  <p>Review the editor guidelines for proper editorial conduct.</p>
                  View Editor Guidelines
                </div>
              </div>

              <h4>Your Responsibilities:</h4>
              <ul>
                <li><strong>Decision Making:</strong> Make decisions on manuscript acceptance or rejection.</li>
                <li><strong>Workflow Management:</strong> Coordinate with authors, reviewers, and the production team.</li>
              </ul>
            </div>
          </>
        )}

        {role === 'Reviewer' && (
          <>
            <div className="dashboard-section reviewer-section">
              <h3>Reviewer Dashboard</h3>
              <p>As a Reviewer, your primary responsibility is to provide constructive feedback on submitted manuscripts.</p>

              <div className="dashboard-cards">
                <div className="card">
                  <h4>Review Assignments</h4>
                  <p>Evaluate assigned manuscripts and provide thorough feedback.</p>
                  View Your Review Assignments
                </div>
                <div className="card">
                  <h4>Submit Feedback</h4>
                  <p>Submit your reviews and ratings after evaluation.</p>
                  Submit Review Feedback
                </div>
                <div className="card">
                  <h4>Reviewer Guidelines</h4>
                  <p>Review the guidelines to maintain quality and ethical standards.</p>
                  View Reviewer Guidelines
                </div>
              </div>

              <h4>Your Responsibilities:</h4>
              <ul>
                <li><strong>Timely Reviews:</strong> Complete reviews within the stipulated deadlines.</li>
                <li><strong>Confidentiality:</strong> Maintain confidentiality during the review process.</li>
              </ul>
            </div>
          </>
        )}

        {/* Add any additional role-specific dashboards */}
        {role !== 'Author' && role !== 'Editor' && role !== 'Reviewer' && (
          <div className="error-message">
            <p>Your role does not have a defined dashboard. Please contact the administrator for more information.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
