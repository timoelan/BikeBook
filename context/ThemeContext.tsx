import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ColorScheme = 'blue' | 'red' | 'orange' | 'green' | 'purple';

export interface Theme {
    bg: string;
    bgSecondary: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    accent: string;
    accentText: string;
    tabBar: string;
    input: string;
    danger: string;
}

const ACCENTS: Record<ColorScheme, string> = {
    blue:   '#0A84FF',
    red:    '#FF3B30',
    orange: '#FF9500',
    green:  '#30D158',
    purple: '#BF5AF2',
};

function buildTheme(dark: boolean, scheme: ColorScheme): Theme {
    const accent = ACCENTS[scheme];
    return dark ? {
        bg:          '#0D0D0D',
        bgSecondary: '#1C1C1E',
        card:        '#1C1C1E',
        text:        '#FFFFFF',
        subtext:     '#8E8E93',
        border:      '#2C2C2E',
        accent,
        accentText:  '#FFFFFF',
        tabBar:      '#1C1C1E',
        input:       '#2C2C2E',
        danger:      '#FF453A',
    } : {
        bg:          '#F2F2F7',
        bgSecondary: '#FFFFFF',
        card:        '#FFFFFF',
        text:        '#000000',
        subtext:     '#6C6C70',
        border:      '#E5E5EA',
        accent,
        accentText:  '#FFFFFF',
        tabBar:      '#FFFFFF',
        input:       '#F2F2F7',
        danger:      '#FF3B30',
    };
}

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    colorScheme: ColorScheme;
    toggleDark: () => void;
    setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(true);
    const [colorScheme, setColorSchemeState] = useState<ColorScheme>('blue');

    useEffect(() => {
        AsyncStorage.multiGet(['theme_dark', 'theme_color']).then(([dark, color]) => {
            if (dark[1] !== null) setIsDark(dark[1] === 'true');
            if (color[1]) setColorSchemeState(color[1] as ColorScheme);
        });
    }, []);

    const toggleDark = () => {
        setIsDark(prev => {
            AsyncStorage.setItem('theme_dark', String(!prev));
            return !prev;
        });
    };

    const setColorScheme = (scheme: ColorScheme) => {
        AsyncStorage.setItem('theme_color', scheme);
        setColorSchemeState(scheme);
    };

    return (
        <ThemeContext.Provider value={{
            theme: buildTheme(isDark, colorScheme),
            isDark,
            colorScheme,
            toggleDark,
            setColorScheme,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
    return ctx;
}
