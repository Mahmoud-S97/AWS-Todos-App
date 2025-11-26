export type AuthContextTypes = {
    user: any,
    isLoggedIn: boolean,
    loading: boolean,
    login: (token: string | undefined, isSignedIn: boolean) => Promise<void>,
    logout: () => Promise<void>
}