import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = sessionStorage.getItem("user_id");

  useEffect(() => {
    axios.get(`http://localhost:8097/api/auth/user/${userId}`)
      .then(response => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
        </div>
        <div className="profile-body">
          <div className="profile-details">
            <div><strong>Name:</strong> {userData.name}</div>
            <div><strong>Email:</strong> {userData.email_id}</div>
            <div><strong>Role:</strong> {userData.role}</div>
            <div><strong>Affiliation:</strong> {userData.affiliation}</div>
            <div><strong>Area of Research:</strong> {userData.area_of_research}</div>
            <div><strong>Country:</strong> {userData.country}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
