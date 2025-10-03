import React from 'react';

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
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: 20, 
          fontFamily: 'sans-serif',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dc3545',
          borderRadius: 8,
          margin: 20
        }}>
          <h2 style={{ color: '#dc3545' }}>🚨 Something went wrong</h2>
          <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
          <details>
            <summary>Error Details</summary>
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: 10, 
              borderRadius: 4,
              overflow: 'auto',
              fontSize: '0.8em'
            }}>
              {this.state.errorInfo?.componentStack || 'No error details available'}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            🔄 Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
