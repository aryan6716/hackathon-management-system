import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-[#0a0a0a] text-white p-6">
          <div className="max-w-md w-full text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
            <p className="text-gray-400 text-sm">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 px-6 py-2 bg-brand-violet hover:bg-brand-violet/80 text-white font-medium rounded-lg transition-colors"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
