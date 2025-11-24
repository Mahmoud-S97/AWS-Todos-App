import { Alert, Dimensions } from 'react-native';
import { ERROR_CODES } from '../constants/AWS/auth/ErrorCodes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOCAL_STORAGE_KEYS } from '../constants/AWS/auth/localStorageKeys';
import { AuthErrors } from './types';

const triggerAlert = (buttonText: string, errorMessage: string): any => {

    Alert.alert('', errorMessage || 'Error occurred, please try again later', [
        {
            text: buttonText
        }
    ]);
}

export const getErrorMessage = (error: AuthErrors): void => {
    switch (error.name) {
        case ERROR_CODES.UsernameExistsException:
            triggerAlert('Login', error.message);
            break;
        case ERROR_CODES.UserNotConfirmedException:
            triggerAlert('Confirm Code', error.message);
            break;
        case ERROR_CODES.UserNotFoundException:
            triggerAlert('Create new user?', error.message);
            break;
        default:
            triggerAlert('Ok', error.message);
    }
}

export const saveDataToAsyncStorage = async (key: string, data: any) => {
    try {
        await AsyncStorage.setItem(key, data);
    } catch (error) {
        console.log('Error while saving to AsyncStorage: ', error);
    }
}

export const getDataToAsyncStorage = async (key: string): Promise<any> => {
    try {
        const data = await AsyncStorage.getItem(key);
        if (!data) return null;
        return data;
    } catch (error) {
        console.log('Error while getting data from AsyncStorage: ', error);
    }
}

export const removeDataFromAsyncStorage = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log('Error while removing data from AsyncStorage: ', error);
    }
}

export const getAccessToken = async () => {
    return await getDataToAsyncStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
}

export const signOutAndRemoveAcessToken = async () => {
    try {
        await AsyncStorage.multiRemove([LOCAL_STORAGE_KEYS.ACCESS_TOKEN, LOCAL_STORAGE_KEYS.IS_LOGGED_IN]);
    } catch (error) {
        console.log('Error while removing Auth-Session from AsyncStorage: ', error);
    }
}

export const getScreenHeight = () => Dimensions.get('screen').height;

export const getScreenWidth = () => Dimensions.get('screen').width;