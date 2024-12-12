import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReviewSection = ({ reviewData, reviewHeading }) => {
  if (!Array.isArray(reviewData) || reviewData.length === 0) {
    return <p>No reviewer data available for this review.</p>;
  }

  return (
    <div style={styles.reviewContainer}>
      <h3 style={styles.reviewHeading}>{reviewHeading}</h3>
      {reviewData.map((reviewer, index) => (
        <div key={index} style={styles.reviewerBox}>
          <p style={styles.text}>
            <strong>Name:</strong> {reviewer.name}
          </p>
          <p style={styles.text}>
            <strong>Review Comment:</strong> {reviewer.comment}
          </p>
          <p style={styles.text}>
            <strong>Status:</strong>{" "}
            <span style={styles.statusText(reviewer.status)}>
              {reviewer.status}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

const JournalDetails = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { piId } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8097/status_trans/${piId}`
        );
        const fetchedReviews = response.data;

        console.log("Fetched Reviews:", fetchedReviews);

        const groupedReviews = fetchedReviews.reduce((acc, review) => {
          const manuscript_id = review.manuscript_id;
          let reviewHeading;

          if (manuscript_id.includes("-CR")) {
            reviewHeading = "Final Review";
          } else if (manuscript_id.includes("-R")) {
            const reviewNumber = parseInt(
              manuscript_id.split("-R")[1].split("-")[0]
            );
            reviewHeading = `Review ${reviewNumber + 1}`;
          } else {
            reviewHeading = "Review 1";
          }

          const reviewGroup = acc.find(
            (group) => group.reviewHeading === reviewHeading
          );
          const reviewerData = {
            user_id: review.loginData.user_id,
            name: review.loginData.username,
            comment: review.comment,
            status: review.status,
          };

          if (reviewGroup) {
            reviewGroup.reviewData.push(reviewerData);
          } else {
            acc.push({
              reviewHeading,
              reviewData: [reviewerData],
            });
          }

          return acc;
        }, []);

        setReviews(groupedReviews);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch reviews.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [piId]);

  const getCurrentEditorStatus = () => {
    for (let i = reviews.length - 1; i >= 0; i--) {
      const editorReview = reviews[i].reviewData.find(
        (reviewer) => reviewer.user_id === 3
      );
      if (editorReview) {
        return editorReview.status; // Return the editor's status for user_id: 3
      }
    }
    return "No Editor Status Found"; // Fallback if no editor status is available
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const currentEditorStatus = getCurrentEditorStatus();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Journal Details</h1>
        <h2 style={styles.currentStatus}>
          Current Status:{" "}
          <span style={styles.statusText(currentEditorStatus)}>
            {currentEditorStatus}
          </span>
        </h2>
      </div>
      <hr style={styles.divider} />
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ReviewSection
            key={index}
            reviewData={review.reviewData}
            reviewHeading={review.reviewHeading}
          />
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    color: "#333",
    maxWidth: "1000px",
    margin: "20px auto",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    borderRadius: "8px",
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
  currentStatus: {
    fontSize: "20px",
    margin: 0,
  },
  statusText: (status) => ({
    fontWeight: "bold",
    color:
      status === "Accept"
        ? "#28a745"
        : status === "Minor Revision"
        ? "#ffc107"
        : status === "Major Revision"
        ? "#ce800e"
        : status === "Submitted"
        ? "#2714cb"
        : "#dc3545",
  }),
  divider: {
    margin: "20px 0",
    border: "1px solid #ddd",
  },
  reviewContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
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
    borderRadius: "5px",
    backgroundColor: "#f8f8f8",
  },
  text: {
    fontSize: "16px",
    margin: "5px 0",
  },
};

export default JournalDetails;
