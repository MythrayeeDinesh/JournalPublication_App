import React, { useEffect, useState } from "react";
import axios from "axios";
import FileUploadComponent from "./FileUploadComponent";
import "../components/css/CommonCss.css"; // Custom styling for better presentation

const JournalSubmissionNew = () => {
  const [paperName, setPaperName] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [submissionType, setSubmissionType] = useState("");
  const [articleType, setArticleType] = useState("");
  const [keywords, setKeywords] = useState("");
  const [numAuthors, setNumAuthors] = useState(1);
  const [authorDetails, setAuthorDetails] = useState([]);
  const [errors, setErrors] = useState({});
  const [conflict, setConflict] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(1); // Tracks form step (1 = journal form, 2 = file upload)
  const [journalId, setJournalId] = React.useState(null);
  const userId = sessionStorage.getItem("user_id");

  const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!paperName) newErrors.paperName = "Paper name is required.";
    if (!title) newErrors.title = "Title is required.";
    if (!abstract) newErrors.abstract = "Abstract is required.";
    if (!articleType) newErrors.articleType = "Article type is required.";
    if (!keywords) newErrors.keywords = "Keywords are required.";
    if (!conflict) newErrors.conflict = "Conflict of interest is required.";

    for (let i = 0; i < numAuthors; i++) {
      const author = authorDetails[i] || {};
      if (!author.name) newErrors[`author${i}Name`] = `Name for Author #${i + 1} is required.`;
      if (!author.email) newErrors[`author${i}Email`] = `Email for Author #${i + 1} is required.`;
      if (!author.country) newErrors[`author${i}Country`] = `Country for Author #${i + 1} is required.`;
      if (!author.affiliation) newErrors[`author${i}Affiliation`] = `Affiliation for Author #${i + 1} is required.`;
      if(!author.phone_number) newErrors[`author${i}Phone number`] =`Phone number for Author #${i + 1} is required.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = {
      journal_name: paperName,
      title,
      abstract_name: abstract,
      article_type: articleType,
      keywords,
      conflict_of_interest: conflict,
      conflict_of_interest_comments: details,
      user_id:userId,
    };
  
    try {
      const journalResponse = await axios.post("http://localhost:8097/add_journaldata", formData);
      if (journalResponse?.data) {
        alert("Journal details submitted successfully!");
  
        // Get the journal ID or any required reference from the response
        const journalId = journalResponse.data.piId;
  
        const formattedAuthorsData = authorDetails.map((author,index) => ({
          ...author,
          author_position: index + 1,
          journalSubmission: {
            piId: journalId, // Attach the journal ID to each author's journalSubmission field
          },
        }));
        
        // Second API call: Save author details
        const authorsResponse = await axios.post(
          "http://localhost:8097/add_authordata",
          formattedAuthorsData
        );
  
        if (authorsResponse?.data) {
          alert("Author details submitted successfully!");
          setJournalId(journalResponse.data.piId);
          setStep(2); // Proceed to file upload
        } else {
          alert("Author details submission was unsuccessful. Please try again.");
        }
      } else {
        alert("Journal details submission was unsuccessful. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const handleAuthorCountChange = (e) => {
    const count = Number(e.target.value);
    setNumAuthors(count);
    setAuthorDetails(new Array(count).fill({}));
  };

  const handleAuthorDetailChange = (index, field, value) => {
    const updatedAuthors = [...authorDetails];
    updatedAuthors[index] = {
      ...updatedAuthors[index],
      [field]: value,
      author_position: index + 1,
    };
    setAuthorDetails(updatedAuthors);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`author${index}${field}`];
      return newErrors;
    });
  };

  // useEffect(() => {
  //   setStep(2);
  // });

  const renderAuthorFields = () =>
    Array.from({ length: numAuthors }, (_, i) => (
      <div key={i} className="author-details">
        <h5>Author #{i + 1}</h5>
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Author's Name"
            value={authorDetails[i]?.name || ""}
            onChange={(e) => handleAuthorDetailChange(i, "name", e.target.value)}
          />
          {errors[`author${i}Name`] && <small className="error-text">{errors[`author${i}Name`]}</small>}
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            className="form-control"
            placeholder="Author's Email"
            value={authorDetails[i]?.email || ""}
            onChange={(e) => handleAuthorDetailChange(i, "email", e.target.value)}
          />
          {errors[`author${i}Email`] && <small className="error-text">{errors[`author${i}Email`]}</small>}
        </div>
        <div className="form-group">
          <label>Country *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Author's Country"
            value={authorDetails[i]?.country || ""}
            onChange={(e) => handleAuthorDetailChange(i, "country", e.target.value)}
          />
          {errors[`author${i}Country`] && <small className="error-text">{errors[`author${i}Country`]}</small>}
        </div>
        <div className="form-group">
          <label>Affiliation *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Author's Affiliation"
            value={authorDetails[i]?.affiliation || ""}
            onChange={(e) => handleAuthorDetailChange(i, "affiliation", e.target.value)}
          />
          {errors[`author${i}Affiliation`] && <small className="error-text">{errors[`author${i}Affiliation`]}</small>}
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Author's Phone number"
            value={authorDetails[i]?.phone_number || ""}
            onChange={(e) => handleAuthorDetailChange(i, "phone_number", e.target.value)}
          />
          {errors[`author${i}phone_number`] && <small className="error-text">{errors[`author${i}phone_number`]}</small>}
        </div>
      </div>
    ));

  return (
    <div className="dashboard-content" style={{ marginLeft: '250px', padding: '20px' }}>
    <div className="journal-submission-form">
      {step === 1 ? (
        <>
          <h3>New Journal Submission</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Paper Name *</label>
              <input
                type="text"
                className="form-control"
                value={paperName}
                onChange={(e) => {
                  setPaperName(e.target.value);
                  setErrors((prev) => ({ ...prev, paperName: "" }));
                }}
              />
              {errors.paperName && <small className="error-text">{errors.paperName}</small>}
            </div>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
              />
              {errors.title && <small className="error-text">{errors.title}</small>}
            </div>
            <div className="form-group">
              <label>Abstract *</label>
              <textarea
                className="form-control"
                rows="5"
                value={abstract}
                onChange={(e) => {
                  setAbstract(e.target.value);
                  setErrors((prev) => ({ ...prev, abstract: "" }));
                }}
              />
              {errors.abstract && <small className="error-text">{errors.abstract}</small>}
            </div>
     
            <div className="form-group">
              <label>Article Type *</label>
              <select
                className="form-control"
                value={articleType}
                onChange={(e) => {
                  setArticleType(e.target.value);
                  setErrors((prev) => ({ ...prev, articleType: "" }));
                }}
              >
                <option value="">Select</option>
                <option value="research">Research</option>
                <option value="review">Review</option>
              </select>
              {errors.articleType && <small className="error-text">{errors.articleType}</small>}
            </div>
            <div className="form-group">
              <label>Keywords *</label>
              <input
                type="text"
                className="form-control"
                value={keywords}
                onChange={(e) => {
                  setKeywords(e.target.value);
                  setErrors((prev) => ({ ...prev, keywords: "" }));
                }}
              />
              {errors.keywords && <small className="error-text">{errors.keywords}</small>}
            </div>
            <div className="form-group">
              <label>Number of Authors *</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={numAuthors}
                onChange={handleAuthorCountChange}
              />
            </div>
            {renderAuthorFields()}
            <div className="form-group">
              <label>Conflict of Interest *</label>
              <select
                className="form-control"
                value={conflict}
                onChange={(e) => {
                  setConflict(e.target.value);
                  setErrors((prev) => ({ ...prev, conflict: "" }));
                }}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              {errors.conflict && <small className="error-text">{errors.conflict}</small>}
            </div>
            <div className="form-group">
              <label>Conflict Details</label>
              <textarea
                className="form-control"
                rows="3"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </>
      ) : (
        <>
          <h3>Upload Files</h3>
          
        <FileUploadComponent journalId={journalId} onFileChange={handleFileChange} />
    
        </>
      )}
    </div>
    </div>
  );
};

export default JournalSubmissionNew;
