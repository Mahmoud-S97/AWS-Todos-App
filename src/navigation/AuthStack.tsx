import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';

import LoginScreen from "../screens/Auth/Login";
import SignUpScreen from "../screens/Auth/SignUp";
import SignUpVerificationScreen from "../screens/Auth/SignUp/SignUpVerification";


const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
            <Stack.Screen name='SignUpVerification' component={SignUpVerificationScreen} />
        </Stack.Navigator>
    )
}

export default AuthStack;