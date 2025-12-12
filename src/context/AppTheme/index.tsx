import React, { useState, JSX, ReactNode, createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContextTypes, ThemeTypes } from './types';
import { colorScheme } from 'nativewind';

const ThemeContext = createContext<ThemeContextTypes>({
    appTheme: "light",
    toggleAppTheme: () => { }
});

export const AppThemeProvider = ({ children }: { children: ReactNode }): JSX.Element => {

    const systemTheme = useColorScheme();
    const [appTheme, setAppTheme] = useState<ThemeTypes>(systemTheme == 'dark' ? 'dark' : 'light');

    const toggleAppTheme = () => {
        const nextTheme = appTheme === 'dark' ? 'light' : 'dark';
        setAppTheme(nextTheme);
        colorScheme.set(nextTheme);
    }

    return (
        <ThemeContext.Provider value={{ appTheme, toggleAppTheme }}>
            {children}
        </ThemeContext.Provider>
    )

}

export const useAppTheme = () => useContext(ThemeContext);