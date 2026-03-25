import { useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../../config";
import Navbar from "../Navbar";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

function PrintPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("bw");
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const { pdfFile, shopId } = location.state || {};
  if (!pdfFile || !shopId) return <p>Invalid print request</p>;

  // Upload PDF to server → Cloudinary
  useEffect(() => {
    const uploadPdf = async () => {
      try {
        const formData = new FormData();
        formData.append("file", pdfFile);

        const res = await axios.post(
          `${serverUrl}/api/upload/print`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        setPdfUrl(res.data.pdfUrl);
      } catch (err) {
        console.error("Upload failed:", err);
        alert("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };
    uploadPdf();
  }, [pdfFile]);

  // Count pages
  useEffect(() => {
    if (!pdfUrl) return;

    const loadPdf = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        setPageCount(pdf.numPages);
        setEndPage(pdf.numPages);
      } catch (err) {
        console.error("Failed to load PDF:", err);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  const validatedStart = Math.max(1, Math.min(startPage, pageCount));
  const validatedEnd = Math.max(validatedStart, Math.min(endPage, pageCount));
  const totalPrice =
    (validatedEnd - validatedStart + 1) * copies * (color === "bw" ? 3 : 10);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      renderToolbar: () => <></>,
    },
  });

  const handleAddToCartPrint = () => {
    if (!pdfUrl) return;

    dispatch(
      addToCart({
        id: Date.now(),
        name: "Print Document",
        shopType: "print",
        shopId,
        price: totalPrice,
        quantity: 1,
        printDetails: {
          pdfFile: pdfUrl,
          startPage: validatedStart,
          endPage: validatedEnd,
          copies,
          color,
          pricePerPage: color === "bw" ? 3 : 10,
        },
      }),
    );

    navigate("/cart");
  };

  if (loading) return <p>Loading PDF...</p>;

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <MdKeyboardBackspace
          onClick={() => navigate(-1)}
          style={{ fontSize: "26px", cursor: "pointer" }}
        />
        <h2>Printout Preview</h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth > 768 ? "2fr 1fr" : "1fr",
          marginTop: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "10px",
            borderRadius: "8px",
            height: "calc(100vh - 260px)",
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {pdfUrl && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl}
                defaultScale={SpecialZoomLevel.PageFit}
              />
            </Worker>
          )}
        </div>

        <div
          style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}
        >
          <h3>Print Settings</h3>
          <p>
            <strong>Total Pages:</strong> {pageCount}
          </p>

          <div style={{ marginTop: "15px" }}>
            <p>Copies</p>
            <button
              onClick={() => setCopies(Math.max(1, copies - 1))}
              style={{ border: "none" }}
            >
              −
            </button>
            <span style={{ margin: "0 10px" }}>{copies}</span>
            <button
              onClick={() => setCopies(copies + 1)}
              style={{ border: "none" }}
            >
              +
            </button>
          </div>

          <div style={{ marginTop: "15px" }}>
            <p>Print Colour</p>
            <button
              onClick={() => setColor("bw")}
              style={{
                background: color === "bw" ? "#e6f4ea" : "#fff",
                marginRight: "10px",
                border: "none",
              }}
            >
              B&W ₹3
            </button>
            <button
              onClick={() => setColor("color")}
              style={{
                background: color === "color" ? "#e6f4ea" : "#fff",
                border: "none",
              }}
            >
              Color ₹10
            </button>
          </div>

          <div style={{ marginTop: "15px" }}>
            <p>Page Range</p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="number"
                min="1"
                max={pageCount}
                value={validatedStart}
                onChange={(e) => setStartPage(Number(e.target.value))}
                style={{ width: "70px" }}
              />
              <span>to</span>
              <input
                type="number"
                min="1"
                max={pageCount}
                value={validatedEnd}
                onChange={(e) => setEndPage(Number(e.target.value))}
                style={{ width: "70px" }}
              />
            </div>
            <p style={{ fontSize: "14px", marginTop: "5px" }}>
              Selected Pages: {validatedEnd - validatedStart + 1}
            </p>
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#f0fff4",
              borderRadius: "6px",
            }}
          >
            <strong>Total: ₹{totalPrice}</strong>
          </div>

          <button
            onClick={handleAddToCartPrint}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "10px",
              background: "#2e7d32",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrintPreview;
