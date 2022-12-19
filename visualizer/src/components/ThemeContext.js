import * as React from "react";
import { createTheme } from "@mui/material/styles";

//shared theme stuff
const theme = {
    typography: {
        
    }
}

const LightTheme = createTheme({
    palette: {
        background: {
            default: '#ffffff',
            paper: '#cdd9e8',
            paper2: '#ffffff',
        },
    },
    ...theme,
});

const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        divider: '#282828',
        background: {
            default: '#181818',
            paper: '#1D1D1D',
            paper2: '#282828',
        },
    },
    ...theme,
});

//get dark mode setting from local storage or default to dark mode if undefined
const darkMode = localStorage.getItem('dark-mode') ?? 'true';
const Theme = darkMode === 'true' ? DarkTheme : LightTheme;

const ThemeContext = React.createContext({
    theme: Theme,
    setTheme: () => {}
});

export { ThemeContext, Theme, DarkTheme, LightTheme };