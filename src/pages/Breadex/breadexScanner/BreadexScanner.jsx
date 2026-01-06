import React, { useState, useRef } from "react";
import { roboflowService } from "../../../services/roboflowService";
import "./BreadexScanner.css";
import CloseButton from "../../../components/closeButton/CloseButton";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import { Camera, UploadCloud, Download, RotateCcw, AlertCircle, Scan } from 'lucide-react';

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
    <div className="wrapper-m scanner-wrapper">
      <CloseButton />
      <canvas ref={canvasRef} className="hidden-canvas" />

      <div className="scanner-container">
        <div className="scanner-header">
          <h1>Breadex</h1>
          <span>Scanner</span>
        </div>

        <div className="scanner-content">
          
          {!inputImage && (
            <div className="scanner-card upload-mode">
              <div className="icon-badge">
                <Scan size={48} color="var(--primary)" />
              </div>
              <h2>Identify Components</h2>
              <p>Upload a photo of your component to get instant AI analysis.</p>
              
              <div className="upload-zone">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="file-input"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="upload-label-zone">
                  <div className="upload-icon-large">
                    <UploadCloud size={64} color="var(--text-color-secondary)" />
                  </div>
                  <span className="primary-text">Click to upload</span>
                  <span className="secondary-text">or drag and drop here</span>
                </label>
              </div>
            </div>
          )}

          {inputImage && !resultImage && (
            <div className="scanner-card preview-mode">
              <div className="image-display-area">
                <img src={inputImage} alt="Preview" className="display-image" />
                {loading && (
                  <div className="loading-overlay">
                    <LoadingSpinner />
                    <p>Analyzing circuitry...</p>
                  </div>
                )}
              </div>

              {!loading && (
                <div className="action-row">
                  <button onClick={resetScanner} className="secondary">
                    <RotateCcw size={18} style={{ marginRight: '8px' }} />
                    Retake
                  </button>
                  <button onClick={analyzeImage} className="primary scan-btn">
                    <Camera size={18} style={{ marginRight: '8px' }} />
                    Start Scan
                  </button>
                </div>
              )}
            </div>
          )}

          {resultImage && (
            <div className="scanner-card result-mode">
              <div className="result-display-area">
                <img src={resultImage} alt="Result" className="display-image" />
                
                <div className="stats-badges">
                  <span className="badge success">
                     {predictions.length} Components Correct
                  </span>
                  <span className="badge info">
                    {(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length * 100).toFixed(1)}% Confidence
                  </span>
                </div>
              </div>

              <div className="action-row">
                <button onClick={resetScanner} className="secondary">
                  <RotateCcw size={18} style={{ marginRight: '8px' }} />
                  New Scan
                </button>
                <button onClick={() => downloadImage(resultImage)} className="success download-btn">
                  <Download size={18} style={{ marginRight: '8px' }} />
                  Download Result
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="error-toast">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
              <button onClick={() => setError("")} className="close-toast">×</button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default BreadexScanner;
