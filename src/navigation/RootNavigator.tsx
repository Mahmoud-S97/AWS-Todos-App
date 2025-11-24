import { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { getAccessToken, getDataToAsyncStorage } from "../utils";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import Spinner from "../components/Spinner";
import { LOCAL_STORAGE_KEYS } from "../constants/AWS/auth/localStorageKeys";


const RootNavigator = () => {

    const [hasToken, setHasToken] = useState<any>(null);
    const [isSignedIn, setIsSignedIn] = useState<boolean>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAccessToken = async () => {
            const accessToken = await getAccessToken();
            const isAlreadySignedIn = await getDataToAsyncStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN);
            setHasToken(!!accessToken);
            setIsSignedIn(isAlreadySignedIn);
            setLoading(false);
            console.log('Navigation-Access-Token: ', accessToken);
            console.log('Navigation-IsSignedIn: ', isAlreadySignedIn);
        }
        checkAccessToken();
    }, []);

    if (loading) return <Spinner />

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                    {isSignedIn && hasToken ? <AppStack /> : <AuthStack />}
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default RootNavigator;