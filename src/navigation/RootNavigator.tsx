import { useContext, JSX } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import Spinner from "../components/Spinner";
import { AuthContext } from "../context/Auth";
import { useAppTheme } from "../context/AppTheme";


const RootNavigator = (): JSX.Element => {

    const { isLoggedIn, loading } = useContext(AuthContext);
    const { appTheme } = useAppTheme();
    const isDark = appTheme === 'dark';

    if (loading) return <Spinner />

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top', 'bottom']} className={isDark ? 'dark:bg-primary-dark flex-1' : 'bg-primary-light flex-1'}>
                <NavigationContainer>
                    {isLoggedIn ? <AppStack /> : <AuthStack />}
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default RootNavigator;