"use client";

import { Component, type ReactNode } from "react";
import { WifiOff } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

/**
 * Error boundary that catches ChunkLoadError (failed dynamic imports).
 * This typically happens when the user goes offline and the browser can't
 * load a code-split chunk. Instead of showing a crash screen, it shows
 * a friendly offline fallback.
 *
 * Automatically recovers when the component re-renders after coming back
 * online (parent re-render resets the boundary).
 */
export class ChunkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const isChunkError =
      error.name === "ChunkLoadError" ||
      error.message.includes("Failed to load chunk") ||
      error.message.includes("Loading chunk") ||
      error.message.includes("Failed to fetch dynamically imported module");

    return { hasError: true, isChunkError };
  }

  componentDidCatch(error: Error) {
    // Only log non-chunk errors (chunk errors are expected when offline)
    if (
      error.name !== "ChunkLoadError" &&
      !error.message.includes("Failed to load chunk")
    ) {
      console.error("ChunkErrorBoundary caught:", error);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when children change (e.g. after coming back online)
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, isChunkError: false });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, isChunkError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      if (this.state.isChunkError) {
        return (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
            <WifiOff className="text-muted-foreground h-10 w-10" />
            <div className="text-center">
              <p className="text-foreground text-sm font-medium">
                Tidak dapat memuat komponen
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Periksa koneksi internet kamu, lalu coba lagi.
              </p>
            </div>
            <button
              onClick={this.handleRetry}
              className="bg-primary text-primary-foreground rounded-none px-4 py-2 text-xs font-semibold"
            >
              Coba Lagi
            </button>
          </div>
        );
      }

      // Non-chunk error — re-throw to parent error boundary
      throw this.state;
    }

    return this.props.children;
  }
}
