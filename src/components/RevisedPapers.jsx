import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RevisedPapers = () => {
  const { piId } = useParams(); // Extract `piId` from URL parameters
  const [paperDetails, setPaperDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState({});
  const [showCopyrightUpload, setShowCopyrightUpload] = useState(false);

  const handleFileUploadChange = (e, fieldName) => {
    setFiles({
      ...files,
      [fieldName]: e.target.files[0],
    });
  };

  const handleCheckboxChange = (e) => {
    setShowCopyrightUpload(e.target.checked);
  };

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8097/status_trans/${piId}`
        );

        if (response.status === 200) {
          const paperData = response.data;

          const reviews = paperData.map((review, index) => ({
            reviewNumber: index + 1,
            reviewerData: [
              {
                name: review.loginData?.username || "N/A",
                comment: review.comment || "No comment provided",
                status: review.status || "Status unavailable",
              },
            ],
          }));

          setPaperDetails({
            piId,
            title: paperData.title || "Untitled Paper",
            reviews,
          });
        } else {
          setError("Unable to load paper details. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching paper details:", err);
        setError("Failed to fetch paper details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaperDetails();
  }, [piId]);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    const uploadData = {
      journalSubmission: {
        piId: paperDetails.piId,
      },
      manuscriptDocFile: `http://localhost:8097/uploads/${files.manuscriptDoc.name}`,
      manuscriptPdfFile: `http://localhost:8097/uploads/${files.manuscriptPdf.name}`,
      authorResponse: `http://localhost:8097/uploads/${files.authorRespond.name}`,
      copyrightForm: showCopyrightUpload && files.copyrightForm
        ? `http://localhost:8097/uploads/${files.copyrightForm.name}`
        : null,
    };

    try {
      await axios.post("http://localhost:8097/paper_uploads", uploadData);

      alert("Your Revised paper uploaded successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error uploading files:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return <div>Loading paper details...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ ...styles.container, marginLeft: '280px' }}>
      <div style={styles.header}>
        <h1 style={styles.title}>Revise Papers</h1>
      </div>

      {paperDetails && (
        <div>
          <form onSubmit={handleFileUpload}>
            <div className="form-group">
              <label>Manuscript Document File Upload</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileUploadChange(e, "manuscriptDoc")}
              />
            </div>
            <div className="form-group">
              <label>Manuscript PDF File Upload</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileUploadChange(e, "manuscriptPdf")}
              />
            </div>
            <div className="form-group">
              <label>Author-Response File Upload</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileUploadChange(e, "authorRespond")}
              />
            </div>
            <div className="form-group d-flex align-items-center mt-3">
              <input
                type="checkbox"
                id="uploadCopyright"
                className="mr-2" style={{ width: "2rem" }}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="uploadCopyright">I want to upload a copyright form</label>
            </div>
            {showCopyrightUpload && (
              <div className="form-group">
                <label>Copyright Form File Upload</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => handleFileUploadChange(e, "copyrightForm")}
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary mt-3">
              Upload All
            </button>
          </form>

          {paperDetails.reviews.map((review, index) => (
            <ReviewSection
              key={index}
              reviewNumber={review.reviewNumber}
              reviewerData={review.reviewerData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ReviewSection = ({ reviewNumber, reviewerData }) => (
  <div style={styles.reviewContainer}>
    <h3 style={styles.reviewHeading}>Review {reviewNumber}</h3>
    {reviewerData.map((data, idx) => (
      <div key={idx} style={styles.reviewerBox}>
        <h4 style={styles.reviewerHeading}>{data.name}</h4>
        <p style={styles.text}>Comment: {data.comment}</p>
        <p style={styles.statusText(data.status)}>Status: {data.status}</p>
      </div>
    ))}
  </div>
);

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    color: "#333",
    maxWidth: "1200px",
    margin: "20px auto",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    borderRadius: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    margin: 0,
  },
  reviewContainer: {
    backgroundColor: "#ffffff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  reviewHeading: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "15px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
  },
  reviewerBox: {
    marginBottom: "15px",
    padding: "15px",
    border: "1px solid #eee",
    borderRadius: "8px",
    backgroundColor: "#f8f8f8",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  reviewerHeading: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#0056b3",
  },
  text: {
    fontSize: "16px",
    margin: "5px 0",
  },
  statusText: (status) => ({
    fontWeight: "bold",
    color:
      status === "Accepted"
        ? "#28a745"
        : status === "Minor Revision"
        ? "#ffc107"
        : status === "Major Revision"
        ? "#dc3545"
        : "#6c757d",
  }),
};

export default RevisedPapers;
