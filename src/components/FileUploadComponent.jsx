import React, { useState } from "react";
import axios from "axios";

const FileUploadComponent = ({ journalId = "4" }) => {
  const [files, setFiles] = useState({
    manuscriptDoc: null,
    manuscriptPdf: null,
    fundings: null,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [includeFundings, setIncludeFundings] = useState(false);
  const [errors, setErrors] = useState({});
  const userId = sessionStorage.getItem("user_id");

  const handleFileChange = (e, fileType) => {
    setFiles({ ...files, [fileType]: e.target.files[0] });
    setErrors((prev) => ({ ...prev, [fileType]: "" }));
    setMessage("");
  };

  const handleFundingsToggle = (e) => {
    setIncludeFundings(e.target.checked);
    if (!e.target.checked) {
      setFiles((prev) => ({ ...prev, fundings: null }));
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasErrors = false;

    if (!files.manuscriptDoc) {
      newErrors.manuscriptDoc = "Manuscript document is required!";
      hasErrors = true;
    }
    if (!files.manuscriptPdf) {
      newErrors.manuscriptPdf = "Manuscript PDF is required!";
      hasErrors = true;
    }
    if (includeFundings && !files.fundings) {
      newErrors.fundings = "Fundings document is required!";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const uploadFields = ["manuscriptDoc", "manuscriptPdf"];
      if (includeFundings) {
        uploadFields.push("fundings");
      }

      const uploadData = {
        journalSubmission: { piId: journalId },
        manuscriptDocFile: "",
        manuscriptPdfFile: "",
        fundings: "",
      };

      for (const field of uploadFields) {
        if (files[field]) {
          const formData = new FormData();
          formData.append("file", files[field]);

          const response = await axios.post(
            `http://localhost:8097/api/files/${field}/${journalId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          if (response.status === 200) {
            setMessage((prev) => `${prev} ${field} uploaded successfully. `);
            uploadData[`${field}File`] = response.data.fileUrl;
          } else {
            throw new Error(`Failed to upload ${field}`);
          }
        }
      }

      const saveResponse = await axios.post(
        "http://localhost:8097/paper_uploads",
        uploadData
      );

      if (saveResponse.status === 200) {
        setMessage("All files uploaded and data stored successfully!");
        await fetchAndSubmitStatus(journalId, userId);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setMessage("File upload failed! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAndSubmitStatus = async (piId, userId) => {
    try {
      const journalResponse = await axios.get(
        `http://localhost:8097/journal_details_byId/${piId}`
      );
      const manuscriptId = journalResponse.data.manuscript_id;

      if (!manuscriptId) {
        throw new Error("Manuscript ID not found in journal details.");
      }

      const statusData = {
        journalSubmission: { piId: piId },
        manuscript_id: manuscriptId,
        comment: "submitted",
        status: "Submitted",
        user_id: userId,
      };

      const statusResponse = await axios.post(
        "http://localhost:8097/create-status",
        statusData
      );

      console.log("Status entry created:", statusResponse.data);
      alert("Your paper submitted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error processing status submission:", error);
      alert("Failed to submit your paper. Please try again later.");
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        
        <form onSubmit={handleFileUpload}>
          <div className="form-group">
            <label>Manuscript Document File Upload</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handleFileChange(e, "manuscriptDoc")}
            />
            {errors.manuscriptDoc && (
              <small className="text-danger">{errors.manuscriptDoc}</small>
            )}
          </div>
          <div className="form-group">
            <label>Manuscript PDF File Upload</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => handleFileChange(e, "manuscriptPdf")}
            />
            {errors.manuscriptPdf && (
              <small className="text-danger">{errors.manuscriptPdf}</small>
            )}
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="fundingsCheck"
              checked={includeFundings}
              onChange={handleFundingsToggle}
            />
            <label className="form-check-label" htmlFor="fundingsCheck">
              Include Fundings Upload
            </label>
          </div>
          {includeFundings && (
            <div className="form-group">
              <label>Fundings File Upload</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, "fundings")}
              />
              {errors.fundings && (
                <small className="text-danger">{errors.fundings}</small>
              )}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload All"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileUploadComponent;
