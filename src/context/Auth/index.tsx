import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { LOCAL_STORAGE_KEYS } from '../../constants/AWS/auth/localStorageKeys';
import { getAccessToken, saveDataToAsyncStorage, signOutAndRemoveAcessToken } from '../../utils';
import { AuthContextTypes } from './types';


export const AuthContext = createContext<AuthContextTypes>({
    user: null,
    isLoggedIn: false,
    loading: true,
    login: async () => { },
    logout: async () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = await getCurrentUser();
                const accessToken = await getAccessToken();
                setUser(currentUser);
                setIsLoggedIn(!!accessToken);
            } catch (error) {
                setUser(null);
                setIsLoggedIn(false);
                console.log('Error while authenticating: ', error);
            } finally {
                setLoading(false);
            }
        }
        initAuth();
    }, []);

    const login = async (token: string | undefined, isSignedIn: boolean) => {
        const currentUser = await getCurrentUser();
        await saveDataToAsyncStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
        await saveDataToAsyncStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN, isSignedIn.toString());
        setUser(currentUser);
        setIsLoggedIn(isSignedIn);
    }

    const logout = async () => {
        await signOutAndRemoveAcessToken();
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}