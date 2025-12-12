export type ThemeTypes = 'light' | 'dark'

export type ThemeContextTypes = {
    appTheme: ThemeTypes,
    toggleAppTheme: () => void
}