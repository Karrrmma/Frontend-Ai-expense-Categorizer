import { useState } from "react";
import { uploadStatement } from "../Api/statementApi";

function UploadStatement() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
    setError("");
    setResult("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      const response = await uploadStatement(file);
      setFileName(response.fileName);
      setResult(response.extractData);
    } catch (error) {
      setError("Failed to upload statement.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Amex Statement Upload</h1>
      <p>Upload a PDF statement and preview the extracted text.</p>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <div style={{ marginTop: "16px" }}>
        <button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Statement"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}

      {fileName && (
        <div style={{ marginTop: "24px" }}>
          <h3>Uploaded File</h3>
          <p>{fileName}</p>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "24px" }}>
          <h3>Extracted Text</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f4f4f4",
              padding: "16px",
              borderRadius: "8px",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}

export default UploadStatement;