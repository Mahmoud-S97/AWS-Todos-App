import React, { useEffect, useState, JSX } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { generateClient } from '@aws-amplify/api';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';
import { getAccessToken, signOutAndRemoveAcessToken } from '../../utils';

export const client = generateClient();

const HomeScreen = (props: any): JSX.Element => {

    const [userInfo, setUserInfo] = useState<any>({});
    const [authData, setAuthData] = useState<any>({});

    const session = async () => {
        const results: any = await fetchAuthSession();
        if(Object.keys(results).length) {
            setAuthData(results.credentials.sessionToken);
        }
        console.log('Auth-Session: ', results);
        const accessToken = await getAccessToken();
        console.log('Access-Token-From-Storage: ', accessToken);
    }
    const currentUser = async () => {
        const results: any = await getCurrentUser();
        if(Object.keys(results).length) {
            setUserInfo(results.signInDetails);
        }
        console.log('Current-User: ', results);
    }

    useEffect(() => {
        session();
        currentUser();
    }, []);

    useEffect(() => {
        console.log(userInfo.loginId, authData);
    }, [userInfo, authData]);

    const logoutHandler = async () => {
        try {
            await signOut();
            await signOutAndRemoveAcessToken();
        } catch (error: any) {
            console.log('Error while logging out: ', error);
            Alert.alert('', error.message);
        }
    }

    return (
        <View style={styles.screen}>
            <Text>Welcome back <Text>{userInfo.loginId}</Text></Text>
            <TouchableOpacity style={styles.signOutBtn} onPress={logoutHandler}>
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                <Text style={styles.mainText}>Home Screen</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    signOutBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
        padding: 10,
        margin: 20
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444'
    },
    mainText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'orange'
    }
})

export default HomeScreen;