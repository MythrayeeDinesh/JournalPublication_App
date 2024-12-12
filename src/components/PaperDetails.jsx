import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import './css/PaperDetails.css';

const PaperDetails = () => {
  const { piId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [journalDetails, setJournalDetails] = useState(null);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [loginDetails, setLoginDetails] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [journalResponse, loginResponse] = await Promise.all([
        axios.get(`http://localhost:8097/journal_details_byId/${piId}`),
        axios.get('http://localhost:8097/api/auth/all'),
      ]);

      const loginData = loginResponse.data;
      setJournalDetails(journalResponse.data);
      setLoginDetails(loginData);

      if (journalResponse.data) {
        const selectedIds = journalResponse.data.reviewerId.split(',').map(Number);
        const preSelectedReviewers = loginData
          .filter((login) => selectedIds.includes(login.user_id))
          .map((login) => ({ value: login.user_id, label: login.username }));
        setSelectedReviewers(preSelectedReviewers);
      }
    } catch (error) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [piId]);

  const handleReviewerChange = (selectedOptions) => {
    setSelectedReviewers(selectedOptions || []);
  };

  const handleReviewSelection = async () => {
    const reviewerIds = selectedReviewers.map((option) => option.value).join(',');
    try {
      await axios.put(
        `http://localhost:8097/updateReviewers/${piId}`,
        { piiid: piId, reviewerIds },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Reviewers updated successfully.');
    } catch (error) {
      alert('Failed to save reviewers. Please try again later.');
    }
  };

  const downloadPdf = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8097/paper_uploads/download_pdf/${piId}/manuscriptPdf`,
        { responseType: 'blob' }
      );

      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'downloaded_file.pdf';

      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/);
        if (matches && matches[1]) {
          fileName = matches[1];
        }
      }

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('File not found!');
      } else {
        alert('Failed to download the file. Please try again later.');
      }
    }
  };

  return (
    <div className="paper-details-container" style={{ maxWidth: '90%', marginLeft: '16rem' }}>
      <header className="paper-header" style={{ backgroundColor: '#007bff' }}>
        <h1>Paper Details</h1>
      </header>
<div className="details-card">
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && journalDetails && (
        <div >
          <h2 className="section-title">Journal Information</h2>
          <div className="details-grid">
            <p><strong>Title:</strong> {journalDetails.title}</p>
            <p><strong>Abstract:</strong> {journalDetails.abstract_name}</p>
            <p><strong>Keywords:</strong> {journalDetails.keywords}</p>
            <p><strong>Journal Name:</strong> {journalDetails.journal_name}</p>
            <p><strong>Article Type:</strong> {journalDetails.article_type}</p>
            <p><strong>Submission Type:</strong> {journalDetails.submission_type}</p>
            <p><strong>Conflict of Interest:</strong> {journalDetails.conflict_of_interest ? 'Yes' : 'No'}</p>
            {journalDetails.conflict_of_interest && (
              <p><strong>Conflict Comments:</strong> {journalDetails.conflict_of_interest_comments}</p>
            )}
          </div>
<br/>
          <h2 className="section-title">Assign Reviewers</h2>
          <Select
            isMulti
            options={loginDetails.map((login) => ({
              value: login.user_id,
              label: login.username,
            }))}
            value={selectedReviewers}
            onChange={handleReviewerChange}
            placeholder="Select reviewers..."
            className="reviewer-dropdown"
          />
          <button className="review-button" onClick={handleReviewSelection}>
            Update Reviewers
          </button>
        </div>
      )}
<br/>
      <div className="download-section">
        <h2 className="section-title">Download Submitted PDF</h2>
        <button onClick={downloadPdf} className="download-button">
          Download PDF
        </button>
      </div>
    </div>
    </div>
  );
};

export default PaperDetails;
