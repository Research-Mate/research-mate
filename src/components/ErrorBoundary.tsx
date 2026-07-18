import { Component, type ErrorInfo, type ReactNode } from "react";
import { CircleAlert } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ResearchMate interface error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-screen">
          <div className="error-screen__card">
            <CircleAlert size={30} aria-hidden="true" />
            <h1>ResearchMate needs a fresh start.</h1>
            <p>Your saved draft is still stored on this device. Refresh the page to continue.</p>
            <button className="button button--primary" type="button" onClick={() => window.location.reload()}>
              Refresh page
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
