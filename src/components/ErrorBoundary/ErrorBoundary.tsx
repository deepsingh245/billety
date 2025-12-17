import { Component, ErrorInfo, ReactNode } from "react";
import { GlobalUIService } from "../../utils/GlobalUIService";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        GlobalUIService.showToast("An unexpected error occurred. Please refresh.");
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    <h1>Sorry.. there was an error</h1>
                    <button onClick={() => window.location.reload()}>Reload Page</button>
                </div>
            );
        }

        return this.props.children;
    }
}
