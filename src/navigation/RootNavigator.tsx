import { useContext, JSX } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import Spinner from "../components/Spinner";
import { AuthContext } from "../context/Auth";


const RootNavigator = (): JSX.Element => {

    const { isLoggedIn, loading } = useContext(AuthContext);

    if (loading) return <Spinner />

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                    {isLoggedIn ? <AppStack /> : <AuthStack />}
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default RootNavigator;