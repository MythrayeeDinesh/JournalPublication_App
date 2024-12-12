import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './css/StatusViewPage.css'; // Ensure this path is correct

const StatusViewPage = () => {
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const userRole = sessionStorage.getItem("role");
    const userId = sessionStorage.getItem("user_id");
    const [review_status,setReviewStatus] = useState('');


    // Function to fetch journal details for author
    const fetchJournalDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8097/journal_details_byUserId/${userId}`);
            
            if (response.status === 404) {
                setError("No journal submissions found for this author.");
                setLoading(false);
                return [];
            }
            return response.data;

            
        } catch (error) {
            console.error('Error fetching journal details:', error);
            setError('Failed to fetch journal details. Please try again later.');
            setLoading(false);
            return [];
        }
    };

    // Function to fetch journal submissions for reviewer
    const fetchJournalSubmissionsForReviewer = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8097/submissions/reviewer/${userId}`);
            
            if (response.data.length === 0) {
                setError("No journal submissions found for this reviewer.");
                setLoading(false);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching journal submissions:', error);
            setError('Failed to fetch journal submissions. Please try again later.');
            setLoading(false);
            return [];
        }
    };

    // Function to fetch all journal submissions for editor
    const fetchAllJournalSubmissions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8097/journal_details');

            if (response.status === 404 || response.data.length === 0) {
                setError("No journal submissions found.");
                setLoading(false);
                return [];
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching all journal submissions:', error);
            setError('Failed to fetch all journal submissions. Please try again later.');
            setLoading(false);
            return [];
        }
    };

    // Function to fetch status_trans data
    const fetchStatusTransData = async (journalDetails) => {
        try {
            const uniquePiIds = [...new Set(journalDetails.map((journal) => journal.piId))];
            const fetchRequests = uniquePiIds.map((piId) =>
                axios.get(`http://localhost:8097/status_trans/${piId}`)
            );

            const responses = await Promise.all(fetchRequests);
            const data = responses.map(response => response.data);

            console.log(data,"status");

            // Combine journal details with their corresponding status data
            const combinedData = journalDetails.map(journal => {
                const statusTrans = data.find(status => 
                    status.some(item => item.journalSubmission.piId === journal.piId)
                );

                if (statusTrans) {
                    const maxStatus = statusTrans.reduce((max, current) => 
                        (current.id > max.id) ? current : max, { id: -1 }
                    );
                    const journ_trans = {...journal,
                    statusTrans: maxStatus};

                    const stat_manuscript_id = journ_trans.manuscript_id;
                    const stat_reviewerId = journ_trans.statusTrans?.journalSubmission?.reviewerId;

                    setReviewStatus(determineStatus(statusTrans,stat_manuscript_id, stat_reviewerId));
                    
                    return {
                        ...journal,
                        statusTrans: maxStatus
                    };
                } else {
                    return {
                        ...journal,
                        statusTrans: null
                    };
                }
            });

            setCombinedData(combinedData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching status_trans data:', error);
            setError('Failed to fetch status_trans data. Please try again later.');
            setLoading(false);
        }
    };

    const determineStatus = (statusTrans,manuscriptId, reviewerIds) => {
        // Filter records for the given manuscript_id
        const manuscriptStatuses = statusTrans.filter(
          (entry) => entry.manuscript_id === manuscriptId
        );

        if (typeof reviewerIds === "string") {
            reviewerIds = reviewerIds.split(",").map(id => parseInt(id.trim(), 10));
        }
      
        // Log manuscript_id and its filtered statuses
        console.log(`Manuscript ID: ${manuscriptId}`, manuscriptStatuses);
        console.log(`Reviewer ID: ${reviewerIds}`);
      
        // Check if all records have the same status as "submitted"
        const uniqueStatuses = [...new Set(manuscriptStatuses.map((entry) => entry.status))];
        if (uniqueStatuses.length === 1 && uniqueStatuses[0] === "submitted") {
          return { status: "submitted" }; // No reviewers required at this stage
        }
      
        const editor_review = manuscriptStatuses.filter((entry) => entry.user_id === 3);
        
        const allReviewed = reviewerIds.every((id) =>
          manuscriptStatuses.some((entry) => entry.user_id === id)
        );
        if(editor_review)
        {
            console.log(editor_review,"editor_rev");
            return { status : editor_review[0].status }
        }
        else if (allReviewed) {
          return { status: "With editor" };
        }
        else{
      
        // Default status: "In review"
        return { status: "In review" };
        }
      };


    const handleDownload = async (piId,manuscriptId) => {
        try {
            console.log('piId:', piId);
    
            const response = await axios.get(
                `http://localhost:8097/paper_uploads/download_pdf/${piId}/manuscriptPdf`,
                { responseType: 'blob' } // Important for handling file downloads
            );
            console.log("File response received.");
    
            // Extract filename from Content-Disposition header if present
            const contentDisposition = response.headers['content-disposition'];
            let fileName = manuscriptId + '.pdf'; // Default filename if not found
    
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="(.+)"/);
                if (matches && matches[1]) {
                    fileName = matches[1];
                }
            }
    
            // Create a temporary URL for the blob and download it
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
    
            link.remove();
            window.URL.revokeObjectURL(url);
    
            console.log('File downloaded successfully.');
        } catch (error) {
            // Improved error handling with detailed logs
            console.error('Error downloading file:', error);
    
            if (error.response) {
                // Handle HTTP errors
                console.error('Response error status:', error.response.status);
                console.error('Response data:', error.response.data);
                console.error('Response headers:', error.response.headers);
    
                if (error.response.status === 404) {
                    alert('File not found!');
                } else if (error.response.status === 500) {
                    alert('Internal server error occurred while downloading the file.');
                } else {
                    alert(`HTTP error occurred: ${error.response.status}`);
                }
            } else if (error.request) {
                // Handle network errors (e.g., no response from server)
                console.error('Request error:', error.request);
                alert('Network error occurred. Please check your connection or server status.');
            } else {
                // Handle other unexpected errors
                console.error('Unexpected error:', error.message);
                alert('An unexpected error occurred while downloading the file.');
            }
        }
    };
    

    const handleWithdrawClick = async (piId) => {
        try {
            await axios.put(`http://localhost:8097/journal_statusUpdate/${piId}`);
            alert('Withdraw successful.');
            setCombinedData((prevData) => prevData.filter((item) => item.piId !== piId));
        } catch (error) {
            console.error('Error withdrawing the journal:', error);
            alert('Failed to withdraw. Please try again later.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let journalDetails = [];

            if (userRole === 'Author') {
                journalDetails = await fetchJournalDetails();
            } else if (userRole === 'Reviewer') {
                journalDetails = await fetchJournalSubmissionsForReviewer();
            } else if (userRole === 'Editor') {
                journalDetails = await fetchAllJournalSubmissions();
            }

            if (journalDetails.length > 0) {
                await fetchStatusTransData(journalDetails);
            }
        };
        fetchData();
    }, [userId, userRole]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="dashboard-content" style={{ marginLeft: '250px', padding: '20px' }}>
            <div>
                <h1>Journal and Status Details</h1>
                {combinedData.length > 0 ? (
                    <table className="styled-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead >
                            <tr>
                                <th>Manuscript ID</th>
                                <th>Submissions</th>
                                <th>Journal Name</th>
                                <th>Title</th>
                                <th>Article Type</th>
                                {/* <th>Keywords</th> */}
                                <th>Status</th>
                                {userRole === 'Author' && <th>Withdraw</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {combinedData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.manuscript_id}</td>
                                    <td>
                                        <a
                                            href="#"
                                            className="assign-reviewer-link"
                                            onClick={() => handleDownload(row.piId, row.manuscript_id)}
                                        >
                                            Download Submissions
                                        </a>
                                        <br /><br />
                                        {userRole === 'Author' && (
                                            <a
                                                href={`/journal-detailsById/${row.piId}`}
                                                className="assign-reviewer-link"
                                            >
                                                Review Details
                                            </a>
                                        )}
                                        {(userRole === 'Reviewer' || userRole === 'Editor') && (
                                            <a
                                                href={`/paper-review-detailsById/${row.piId}`}
                                                className="assign-reviewer-link"
                                            >
                                                Review Paper
                                            </a>
                                        )}
                                        <br/><br/>
                                        {userRole === 'Editor' && (
                                       
                                            <a
                                                href="#"
                                                onClick={() => navigate(`/paper-detailsById/${row.piId}`)}
                                                className="assign-reviewer-link"
                                            >
                                                Assign Reviewer
                                            </a>
                                     
                                    )}
                                  {(review_status.status === "Major Revision" || review_status.status === "Minor Revision") && userRole === 'Author' && (
                                    <a
                                        href="#"
                                        onClick={() => navigate(`/revised-papers/${row.piId}`)}
                                        className="assign-reviewer-link"
                                    >
                                        Revise Paper
                                    </a>
                                    )}
                                    </td>
                                    <td>{row.journal_name}</td>
                                    <td>{row.title}</td>
                                    <td>{row.article_type}</td>
                                    {/* <td>{row.keywords}</td> */}
                                    <td>{review_status.status ? review_status.status : '--'}</td>
                                    {userRole === 'Author' && (
                                        <td>
                                            <a href="#" onClick={() => handleWithdrawClick(row.piId)} style={{ color: 'red', textDecoration: 'none' }}>
                                                Withdraw
                                            </a>
                                        </td>
                                    )}
                                  

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
};

export default StatusViewPage;
