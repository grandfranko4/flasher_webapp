import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          margin: '20px', 
          borderRadius: '8px',
          border: '1px solid #fcc'
        }}>
          <h2 style={{ color: '#c00' }}>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap', fontSize: '14px', marginTop: '10px' }}>
            <summary>Error Details (Click to expand)</summary>
            <div style={{ marginTop: '10px' }}>
              <strong>Error:</strong> {this.state.error && this.state.error.toString()}
            </div>
            <div style={{ marginTop: '10px' }}>
              <strong>Component Stack:</strong>
              <pre style={{ fontSize: '12px', backgroundColor: '#f9f9f9', padding: '10px', marginTop: '5px' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
            <div style={{ marginTop: '10px' }}>
              <strong>Error Stack:</strong>
              <pre style={{ fontSize: '12px', backgroundColor: '#f9f9f9', padding: '10px', marginTop: '5px' }}>
                {this.state.error && this.state.error.stack}
              </pre>
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 