import React, { useEffect, JSX, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { generateClient } from '@aws-amplify/api';
import { signOut } from 'aws-amplify/auth';
import { AuthContext } from '../../context/Auth';

export const client = generateClient();

const HomeScreen = (props: any): JSX.Element => {

    const {logout, user} = useContext(AuthContext);

    const logoutHandler = async () => {
        try {
            await signOut();
            await logout();
        } catch (error: any) {
            console.log('Error while logging out: ', error);
            Alert.alert('', error.message);
        }
    }

    useEffect(() => {
        console.log('UserDetails: ', user);
    }, [])

    return (
        <View style={styles.screen}>
            <Text>Welcome back <Text>{user?.signInDetails.loginId}</Text></Text>
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