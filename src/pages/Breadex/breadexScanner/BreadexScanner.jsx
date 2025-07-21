import React, { useState, useRef } from "react";
import { roboflowService } from "../../../services/roboflowService";
import "./BreadexScanner.css";
import CloseButton from "../../../components/closeButton/CloseButton";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";

function BreadexScanner() {
  const [inputImage, setInputImage] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputImage(reader.result);
        setResultImage("");
        setPredictions([]);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const createAnnotatedImage = (imageUrl, predictions) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = canvasRef.current;
        const annotatedImageUrl = roboflowService.drawPredictionsOnCanvas(
          canvas,
          img,
          predictions
        );
        resolve(annotatedImageUrl);
      };
      img.src = imageUrl;
    });
  };

  const analyzeImage = async () => {
    if (!inputImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setResultImage("");
    setPredictions([]);

    try {
      const result = await roboflowService.analyzeImage(inputImage);

      if (result.success) {
        setPredictions(result.data.predictions || []);

        if (result.data.predictions && result.data.predictions.length > 0) {
          const annotatedImageUrl = await createAnnotatedImage(
            inputImage,
            result.data.predictions
          );
          setResultImage(annotatedImageUrl);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to analyze image: " + err.message);
    }

    setLoading(false);
  };

  const resetScanner = () => {
    setInputImage("");
    setResultImage("");
    setPredictions([]);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadImage = async (imageUrl) => {
    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "breadex-analysis-result.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div className="wrapper-m">
      <CloseButton />
      <canvas ref={canvasRef} className="hidden-canvas" />

      <div className="scanner_head">
        <h1>Breadex</h1>
        <span>Scanner</span>
        {/* <p>Scan and analyze breadboard components using AI</p> */}
      </div>

      <div className="scanner_body">
        <div className="left-section">
          {!inputImage && (
            <div className="upload-card">
              <h3>Upload Image</h3>
              <div className="upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="file-input"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">Click to select image</div>
                  <div className="upload-hint">or drag and drop</div>
                </label>
              </div>
            </div>
          )}

          {inputImage && (
            <div className="image-preview-card">
              <h3>Selected Image</h3>
              <div className="image-container">
                <img
                  src={inputImage}
                  alt="Selected breadboard"
                  className="preview-image"
                />
              </div>
              {!resultImage && (
                <div className="action-buttons">
                  <button
                    onClick={analyzeImage}
                    disabled={loading}
                    className={`primary analyze-button ${
                      loading ? "disabled" : ""
                    }`}
                  >
                    {loading ? "Analyzing..." : "Scan"}
                  </button>
                  <button onClick={resetScanner} className="danger">
                    Change
                  </button>
                </div>
              )}
              {predictions.length > 0 && (
                <div className="detection-summary">
                  <div className="summary-card">
                    <h4>📊 {predictions.length} Components Detected</h4>
                    <p>
                      Average Confidence:{" "}
                      {(
                        (predictions.reduce((sum, p) => sum + p.confidence, 0) /
                          predictions.length) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="right-section">
          {loading && <LoadingSpinner />}

          {error && (
            <div className="error-card">
              <h3>⚠️ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {resultImage && (
            <div className="result-card">
              <div className="result-header">
                <h3>Analysis Result</h3>
                <div className="result-actions">
                  <button
                    onClick={() => downloadImage(resultImage)}
                    className="download-button"
                  >
                    💾 Download
                  </button>
                  <button onClick={resetScanner} className="new-scan-button">
                    🔄 New Scan
                  </button>
                </div>
              </div>

              <div className="result-image-container">
                <img
                  src={resultImage}
                  alt="Analysis result with detected components"
                  className="result-image"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BreadexScanner;
