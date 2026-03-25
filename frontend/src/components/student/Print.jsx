import React, { useRef, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { MdDone } from "react-icons/md";
import "../../style/print.css";

function Print() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { shopId } = useParams();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isFileReady, setIsFileReady] = useState(false);

  const allowedFiles = ["application/pdf", "image/jpeg", "image/png"];
  const [showPopup, setShowPopup] = useState(false);

  const handleFiles = (files) => {
    const selectedFile = files[0];
    if (!selectedFile) return;

    if (!allowedFiles.includes(selectedFile.type)) {
      setFileError("Only PDF or image files allowed");
      setFile(null);
      setIsFileReady(false);
      setShowPopup(false);
      return;
    }

    setFileError("");
    setFile(selectedFile);
    setIsFileReady(true);
    setShowPopup(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const goToPreview = () => {
    if (!file || !isFileReady) return;
    navigate("/print-preview", { state: { pdfFile: file, shopId } });
  };

  return (
    <>
      <Navbar />

      <div style={{ backgroundColor: "#fff", minHeight: "100vh"}}>
        {/* BACK BUTTON */}
        <MdKeyboardBackspace
          onClick={() => navigate("/print-shop")}
          className="back"
        />

        {/* MAIN CONTENT */}
        <div className="print-container"
        >
          {/* LEFT SECTION */}
          <div className="print-upload"
          style={{ flex: 1 }}>
            <h1 className="print-title">Print Store</h1>
            <p style={{ color: "#555", marginTop: "10px" }}>UniMart provides Safe & Secure printouts</p>


            {/* Upload Card */}
            <div className="Upload-card">
              <h1 className="print-title">Upload your files</h1>
              <p style={{ color: "#555", marginTop: "10px" }}>Upload PDF files only</p>
              {/* DROP AREA */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
                style={{
                  border: "2px dashed #9aa3ff",
                  borderRadius: "12px",
                  padding: "25px",
                  marginTop: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                <p>Drag & Drop files here</p>
                <button
                  type="button"
                  style={{
                    backgroundColor: "#433D8B",
                    marginTop: "12px",
                    color: "#fff",
                    padding: "10px 22px",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Upload your files
                </button>

                <input
                  type="file"
                  accept=".pdf,.jpeg,.jpg,.png"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </div>

            {fileError && <p style={{ color: "red" }}>{fileError}</p>}

            {showPopup && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
                onClick={() => setShowPopup(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="open-previewBOx"
                >
                  <h3>File uploaded successfully<MdDone style={{ color: "green",fontSize: "30px" }} /></h3>
                  <p style={{ color: "#666", marginTop: "10px" }}>
                    Ready to preview and print
                  </p>

                  <button
                    onClick={goToPreview}
                    style={{
                      marginTop: "20px",
                      backgroundColor: "#433D8B",
                      color: "#fff",
                      padding: "10px 18px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Open Print Preview
                  </button>

                  <button
                    onClick={() => setShowPopup(false)}
                    style={{
                      marginTop: "10px",
                      background: "transparent",
                      borderRadius:"10px",
                      width:"100%",
                      color: "#090606",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="print-image">
            <img
              src="https://media.istockphoto.com/vectors/print-production-concept-vector-id1273309272?k=20&m=1273309272&s=612x612&w=0&h=xrIvhEoQbPRfFsP5E-_HrLYn3a6uPmkIolw9b1opNP4="
              alt="printer"
              style={{
                width: "600px",
                height: "400px",   
              }}
            />
          </div>
        </div>
        
      </div>
      <Footer/>
    </>
  );
}

export default Print;




