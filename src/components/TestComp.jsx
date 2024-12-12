import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const TestComp = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* PDF Viewer */}
      <div style={{ flex: 2, overflow: "auto", borderRight: "1px solid #ddd" }}>
      <iframe
  src="https://icseindia.org/document/sample.pdf"
  width="100%"
  height="100%"
  title="PDF Viewer"
></iframe>

      </div>

      {/* Reviewer Comments */}
      <div style={{ flex: 1, padding: "16px", overflow: "auto" }}>
        <h3>Reviewer Comments</h3>
        <textarea
          style={{
            width: "100%",
            height: "90%",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
          }}
          placeholder="Write your comments here..."
        ></textarea>
        <button style={{ marginTop: "10px", padding: "8px 16px" }}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default TestComp;
