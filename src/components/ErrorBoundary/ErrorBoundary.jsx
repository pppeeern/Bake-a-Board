import React from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Quiz Error Boundary caught an error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });

    // Try to reload the component
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error_boundary_container">
          <div className="error_boundary_content">
            <div className="error_icon">⚠️</div>
            <h2>Oops! Something went wrong</h2>
            <p>
              Don't worry, your progress is saved. Let's get you back to
              learning!
            </p>

            <div className="error_actions">
              <button onClick={this.handleRetry} className="retry_btn">
                🔄 Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/chapters")}
                className="home_btn"
              >
                🏠 Back to Chapters
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error_details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
