import * as React from "react";

class ErrorBoundary extends React.Component {
    state = { error: null, errorInfo: null };

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
    }

    render() {
        const errorBoundaryStyle = {
            backgroundColor: "#181818",
            padding: "1rem",
            minHeight: "100vh",
        };
        
        const errorStyle = {
            backgroundColor: "#1D1D1D",
            border: "1px solid #282828",
            padding: "1rem",
            whiteSpace: "pre-wrap",
        };

        if (this.state.errorInfo) {
            return (
                <div style={errorBoundaryStyle}>
                    <h2>Something went wrong.</h2>
                    <div style={errorStyle}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
