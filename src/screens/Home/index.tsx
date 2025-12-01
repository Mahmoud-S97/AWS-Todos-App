import React, { useEffect, JSX, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { generateClient } from '@aws-amplify/api';
import { signOut } from 'aws-amplify/auth';
import { AuthContext } from '../../context/Auth';
import MainHeader from '../../components/Global/MainHeader';
import AppIcon from '../../components/Global/AppIcon';

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
            <MainHeader className='bg-orange-400'>
            <TouchableOpacity>
                <AppIcon name='chevron-left' size={30} className='text-white' />
            </TouchableOpacity>
            <Text className='font-[600] text-2xl text-white ms-[6%]'>Latest Todos</Text>
            <View className='flex-row items-center justify-center'>
              <TouchableOpacity activeOpacity={0.6} className='w-[40] h-[40] flex-row justify-center items-center bg-gray-400 rounded-full me-[10]'>
                <AppIcon fontFamily='MaterialIcons' name='light-mode' className='text-gray-700' />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} className='w-[40] h-[40] flex-row justify-center items-center bg-gray-400 rounded-full' onPress={logoutHandler}>
                <AppIcon name='power-off' className='text-gray-700' />
              </TouchableOpacity>
            </View>
          </MainHeader>
            <Text>Welcome back <Text>{user?.signInDetails.loginId}</Text></Text>
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