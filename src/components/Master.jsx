import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Authentication/Login";
import JournalSubmission from "./JournalSubmission";
import Menu from "./Menu";  // Make sure to import the Menu component
import StatusViewPage from "./StatusViewPage";
import JournalDetailsPage from "./JournalDetailsPage";
import PaperDetails from "./PaperDetails";
import PaperReviewDetails from "./PaperReviewDetails";
import Register from "./Authentication/Register";
import Dashboard from "./Dashboard";
import ProfilePage from "./Profile";
import RevisedPapers from "./RevisedPapers";

const Master = () => {
  // Check if the user is logged in by retrieving the role from session storage
  const isLoggedIn = sessionStorage.getItem("role");
  const location = useLocation(); // Get the current location

  // Exclude paths where the menu should not appear
  const noMenuRoutes = ['/', '/register'];

  // Determine if the Menu should be shown (i.e., not on login/register page)
  const showMenu = isLoggedIn && !noMenuRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {/* Conditionally render Menu only if not on login or register pages */}
      {showMenu && <Menu userRole={sessionStorage.getItem("role")} />}

      {/* Content area */}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Route for Login */}
          <Route path="/" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />

          <Route
            path="/profile"
            element={isLoggedIn ? <ProfilePage /> : <Navigate to="/" />}
          />
        
          <Route
            path="/journal-submission"
            element={isLoggedIn ? <JournalSubmission /> : <Navigate to="/" />}
          />

          <Route
            path="/journal-details"
            element={isLoggedIn ? <StatusViewPage /> : <Navigate to="/" />}
          />

          <Route
            path="/journal-detailsById/:piId"
            element={isLoggedIn ? <JournalDetailsPage /> : <Navigate to="/" />}
          />

          <Route
            path="/paper-detailsById/:piId"
            element={isLoggedIn ? <PaperDetails /> : <Navigate to="/" />}
          />

          <Route
            path="/paper-review-detailsById/:piId"
            element={isLoggedIn ? <PaperReviewDetails /> : <Navigate to="/" />}
          />

        <Route
            path="/revised-papers/:piId"
            element={isLoggedIn ? <RevisedPapers /> : <Navigate to="/" />}
          />



          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Master;
