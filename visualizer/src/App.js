import "./App.css";
import * as React from "react";
import Day18 from "./pages/Day18/Day18";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeContext, Theme } from "./components/ThemeContext";

const App = () => {
    const [theme, setTheme] = React.useState(Theme);
    const context = { theme, setTheme };

    return (
        <ThemeContext.Provider value={context}>
            <ErrorBoundary>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={<Day18 />} />
                    </Routes>
                </BrowserRouter>
            </ErrorBoundary>
        </ThemeContext.Provider>
    );
};

export default App;
