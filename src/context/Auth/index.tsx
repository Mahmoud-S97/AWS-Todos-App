import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient, GraphQLResult } from '@aws-amplify/api';
import { LOCAL_STORAGE_KEYS } from '../../constants/AWS/auth/localStorageKeys';
import { getAccessToken, saveDataToAsyncStorage, signOutAndRemoveAcessToken } from '../../utils';
import { AuthContextTypes, UserTypes } from './types';
import { createUser } from '../../graphql/mutations';
import { getUser } from '../../graphql/queries';

const client = generateClient();

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
                const accessToken = await getAccessToken();
                const currentUser = await getCurrentUser();
                await getUserProfile(currentUser.userId);
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

    const login = async (token: string | undefined, isSignedIn: boolean, userProfile: UserTypes) => {
        await saveDataToAsyncStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
        await saveDataToAsyncStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN, isSignedIn.toString());
        await createUserProfile(userProfile);
        setIsLoggedIn(isSignedIn);
    }

    const logout = async () => {
        await signOutAndRemoveAcessToken();
        setIsLoggedIn(false);
    }

    const createUserProfile = async (userInput: UserTypes): Promise<void> => {
        try {
            const { id, sub, email, username, picture: avatar } = userInput;

            const ifUserAlreadyExists = await getUserProfile(id);
            if (ifUserAlreadyExists) return;

            const {data} = await client.graphql({
                query: createUser,
                variables: {
                    input: {
                        id,
                        sub,
                        username,
                        email,
                        avatar
                    }
                }
            }) as GraphQLResult<any>;
            setUser(data?.createUser);
        } catch (error) {
            console.log('Error while creating user Profile: ', error);
        }
    }

    const getUserProfile = async (id: string) => {
        try {
            const {data} = await client.graphql({
                query: getUser,
                variables: { id }
            }) as GraphQLResult<any>;
            setUser(data?.getUser);
            return data?.getUser;
        } catch (error) {
            console.log('Error while fetching user from GraphQL: ', error);
        }
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )

}