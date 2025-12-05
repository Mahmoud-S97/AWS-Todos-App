export type AuthContextTypes = {
    user: any,
    isLoggedIn: boolean,
    loading: boolean,
    login: (token: string | undefined, isSignedIn: boolean, userProfile: UserTypes) => Promise<void>,
    logout: () => Promise<void>
}

export type UserTypes = {
    id: string,
    sub?: string,
    email?: string,
    username?: string,
    picture?: string
}