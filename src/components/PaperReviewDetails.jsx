import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/PaperReviewDetails.css';

const PaperReviewDetails = () => {
  const { piId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [journalDetails, setJournalDetails] = useState(null);
  const [loginDetails, setLoginDetails] = useState({});
  const [reviewerComments, setReviewerComments] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const userId = sessionStorage.getItem("user_id");
  const user_role = sessionStorage.getItem("role");
  const [pdfUrl, setPdfUrl] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [manuscriptId,setManuscriptId] = useState('');
  const fetchData = async () => {
    try {
      setLoading(true);
  
      // Fetch the status data to get the latest manuscript ID
      const fetchRequest = await axios.get(`http://localhost:8097/status_trans/${piId}`);
      const data = fetchRequest.data;
  
      const latestEntry = data.reduce((latest, current) => {
        return current.id > latest.id ? current : latest;
      }, { id: -1 });
  
      const manuscriptId = latestEntry?.journalSubmission?.manuscript_id || '';
      console.log(manuscriptId,"manuscriptId")
      setManuscriptId(manuscriptId);
  
      // Fetch data from other APIs
      const [journalResponse, loginResponse, commentsResponse, pdfResponse, isSubmittedResponse] = await Promise.all([
        axios.get(`http://localhost:8097/journal_details_byId/${piId}`),
        axios.get('http://localhost:8097/api/auth/all'),
        axios.get(`http://localhost:8097/status_trans/${piId}`),
        axios.get(`http://localhost:8097/paper_uploads/download_pdf/${piId}/manuscriptPdf`, {
          responseType: 'blob',
        }),
        axios.get('http://localhost:8097/has-submitted', {
          params: { piId, manuscriptId, userId },
        }),
      ]);
  
      setIsSubmitted(isSubmittedResponse.data);
  console.log(commentsResponse.data,"CommentResponse")
      setJournalDetails(journalResponse.data);
      setReviewerComments(commentsResponse.data || []);
      const url = URL.createObjectURL(pdfResponse.data);
      setPdfUrl(url);
  
      if (journalResponse.data.pdf_url) {
        setPdfFile(journalResponse.data.pdf_url);
      }
  
      const userIds = new Set(commentsResponse.data.map(comment => comment.user_id));
      const loginDataPromises = Array.from(userIds).map(async (id) => {
        try {
          const userResponse = await axios.get(`http://localhost:8097/api/auth/user/${id}`);
          return { userId: id, loginName: userResponse.data.name };
        } catch (userError) {
          console.error(`Error fetching user details for user_id ${id}:`, userError);
          return { userId: id, loginName: 'Unknown' };
        }
      });
  
      const loginData = await Promise.all(loginDataPromises);
      const loginMap = loginData.reduce((acc, { userId, loginName }) => {
        acc[userId] = loginName;
        return acc;
      }, {});
  
      setLoginDetails(loginMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [piId]);

  const handleCommentAndStatusChange = async () => {


    const comment = document.getElementById('commentBox').value;
    const status = document.getElementById('statusSelect').value;

    try {
      const statusData = {
        journalSubmission: {
          piId: piId,
        },
        comment: comment,
        status: status,
        user_id: userId,
        manuscript_id : manuscriptId
      };

      const statusResponse = await axios.post('http://localhost:8097/create-status', statusData);
      console.log('Comment and status updated successfully:', statusResponse.data.user_id);
      alert('Comment and status updated successfully.');
      window.location.reload();
    } catch (statusError) {
      console.error('Error creating status:', statusError);
    }
  };

  const formatDateWithSuffix = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    const suffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${suffix(day)} ${month} ${year}`;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="paper-review-details-container" style={{ marginLeft: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    {/* Combined Paper Information and Reviewer Comments Section */}
    <div className="paper-info-comments-section" style={{ display: 'flex', gap: '20px' }}>
      {/* Paper Information Section (Left) */}
      <div className="paper-info-section" style={{ flex: 1 }}>
      <h3>Paper Information</h3>
        {journalDetails ? (
          <div className="details-card">            
            <p><strong>Title:</strong> {journalDetails.title}</p>
            <p><strong>Abstract:</strong> {journalDetails.abstract_name}</p>
            <p><strong>Keywords:</strong> {journalDetails.keywords}</p>
            <p><strong>Journal Name:</strong> {journalDetails.journal_name}</p>
            <p><strong>Article Type:</strong> {journalDetails.article_type}</p>
            <p><strong>Submission Type:</strong> {journalDetails.submission_type}</p>
            <p><strong>Conflict of Interest:</strong> {journalDetails.conflict_of_interest ? 'Yes' : 'No'}</p>
            {journalDetails.conflict_of_interest && (
              <p><strong>Conflict of Interest Comments:</strong> {journalDetails.conflict_of_interest_comments}</p>
            )}
          </div>
        ) : (
          <p>No journal details available.</p>
        )}
      </div>
  
      <div className="reviewer-comments-section" style={{ flex: 1, overflowY: 'auto', maxHeight: '500px' }}>
  <h3>Comments & Status</h3>

  {Array.isArray(reviewerComments) && reviewerComments.length > 0 ? (
    Object.entries(
      reviewerComments
        .filter(review => review?.status?.toLowerCase() !== 'submitted')
        .reduce((acc, review) => {
          const { manuscript_id, comment, status, created_date, user_id } = review;
          const reviewHeading = manuscript_id.includes('-CR')
            ? 'Final Review'
            : manuscript_id.includes('-R')
            ? `Review ${parseInt(manuscript_id.split('-R')[1].split('-')[0]) + 1}`
            : 'Review 1';

          if (!acc[reviewHeading]) {
            acc[reviewHeading] = [];
          }
          acc[reviewHeading].push({ review, user_id, comment, status, created_date });

          return acc;
        }, {})
    ).map(([heading, group], index) => (
      <div key={index} className="review-group">
        <h3>{heading}</h3>
        {group.map((reviewData, reviewIndex) => (
          <div key={reviewIndex} className="review-card">
            <p><strong>Reviewed By:</strong> {loginDetails[reviewData.user_id] || 'Unknown'}</p>
            <p><strong>Comment:</strong> {reviewData.comment || 'No comment available'}</p>
            <p><strong>Status:</strong> {reviewData.status || 'Unknown'}</p>
            <p><strong>Date:</strong> {formatDateWithSuffix(reviewData.created_date)}</p>
          </div>
        ))}
      </div>
    ))
  ) : (
    <p>No reviewer comments found.</p>
  )}
</div>

</div>

      
  
    <div className="pdf-review-container" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
  {/* PDF Viewer Section (Left) */}
  <div className="pdf-viewer-section" style={{ flex: 1, height: '500px' }}>
    <iframe
      src={pdfUrl}
      width="100%"
      height="100%"
      title="PDF Viewer"
      style={{ border: '1px solid #ccc', borderRadius: '5px' }}
    ></iframe>
  </div>

  {/* Comment and Status Section (Right) */}
  <div className="comment-status-section" style={{ flex: 1 }}>
    <h3>
      {user_role === 'Reviewer' ? 'Recommendation' : 
      user_role === 'Editor' ? 'Decision' : 
      'Leave a Comment & Update Status'}
    </h3>
    <textarea
      id="commentBox"
      className="comment-box"
      placeholder="Write your comment here..."
      style={{ width: '100%', marginBottom: '10px' }}
    />
    <select id="statusSelect" className="status-dropdown" style={{ width: '100%', marginBottom: '10px' }}>
      <option value="Under Review">Under Review</option>
      <option value="Unsubmit">Unsubmit</option>
      <option value="Accept">Accept</option>
      <option value="Major Revision">Major Revision</option>
      <option value="Minor Revision">Minor Revision</option>
      <option value="Reject">Reject</option>
    </select>
    
    {(Array.isArray(isSubmitted) && isSubmitted.length === 0) && ( 
        <button
          className="comment-status-button"
          onClick={handleCommentAndStatusChange}
          style={{ width: '100%' }}
        >
          Save Comment and Status
        </button>
      )}
  </div>
</div>
  </div>
  
  );
};

export default PaperReviewDetails;
