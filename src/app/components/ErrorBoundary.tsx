import * as React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F2F2F2] flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-black tracking-tighter mb-4">Oops!</h1>
          <p className="text-[13px] opacity-60 mb-8 text-center max-w-md">
            Something went wrong. Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-[10px] font-black tracking-[0.3em] uppercase border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-all"
          >
            [ REFRESH ]
          </button>
          {this.state.error && (
            <details className="mt-8 text-[10px] opacity-40">
              <summary>Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap">{this.state.error.toString()}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
