import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainComponent from './components/MainComponent';
import MenuComponent from './components/Menu'; 
import JournalSubmission from './components/JournalSubmission';
import StatusViewPage from './components/StatusViewPage';
import JournalDetailsPage from './components/JournalDetailsPage';
import PaperDetails from './components/PaperDetails';
import PaperReviewDetails from './components/PaperReviewDetails';
import Register from './components/Authentication/Register';
import Login from './components/Authentication/Login'; // Ensure correct path
import ProfilePage from './components/Profile';
import RevisedPapers from './components/RevisedPapers';

function App() {
  const location = useLocation();

  // Define routes without MenuComponent
  const noMenuRoutes = ['/', '/register', '/login'];

  // Determine if MenuComponent should be displayed
  const showMenu = !noMenuRoutes.includes(location.pathname);

  return (
    <div>
      {showMenu && <MenuComponent />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/journal-submission" element={<JournalSubmission />} />
        <Route path="/revised-papers/:piId" element={<RevisedPapers/>}/>
        <Route path="/journal-details" element={<StatusViewPage />} />
        <Route path="/journal-details/:piId" element={<JournalDetailsPage />} />
        <Route path="/paper-detailsById/:piId" element={<PaperDetails />} />
        <Route path="/paper-review-detailsById/:piId" element={<PaperReviewDetails />} />
      </Routes>
    </div>
  );
}

export default App;
