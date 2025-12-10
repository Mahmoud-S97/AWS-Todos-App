import React, { useState, JSX, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { fetchAuthSession, fetchUserAttributes, getCurrentUser, signInWithRedirect, signUp } from 'aws-amplify/auth';
import { getErrorMessage } from '../../../utils';
import { ERROR_CODES } from '../../../constants/AWS/auth/ErrorCodes';
import { APP_THEME } from '../../../theme/styles';
import { AuthContext } from '../../../context/Auth';
import Spinner from '../../../components/Spinner';
import MainHeader from '../../../components/Global/MainHeader';
import AppIcon from '../../../components/Global/AppIcon';
import MainButton from '../../../components/Global/MainButton';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>

const SignUpScreen = ({ navigation }: Props): JSX.Element => {

  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const goBack = () => navigation.goBack();

  const SignUpHandler = async () => {
    try {
      setLoading(true);
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } }
      });
      Alert.alert('', 'Account created, please check your email for your confirmation!', [
        {
          text: 'Verify Code',
          onPress: () => navigation.navigate('SignUpVerification', { userName: email })
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]);
    } catch (error: any) {
      getErrorMessage(error);
      if (error.name === ERROR_CODES.UsernameExistsException) {
        navigation.navigate('Login');
      }
      if (error.name === ERROR_CODES.UserNotConfirmedException) {
        navigation.navigate('SignUpVerification', { userName: email });
      }
    } finally {
      setLoading(false);
    }
  }

  const SignUpWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithRedirect({
        provider: 'Google',
        options: {
          preferPrivateSession: true
        }
      });
      const { credentials } = await fetchAuthSession();
      if (credentials?.sessionToken) {

        const userAttributes = await fetchUserAttributes();
        const currentUser = await getCurrentUser();
        const { email, name: username, picture, sub } = userAttributes;

        const userProfile = {
          id: currentUser.userId,
          sub,
          username,
          email,
          picture
        }
        await login(credentials?.sessionToken, !!credentials?.sessionToken, userProfile);

        Alert.alert('', 'Logged in successfully', [
          {
            text: 'Ok, thanks'
          }
        ]);
      }
    } catch (error) {
      console.log('Error while signing with Google: ', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />

  return (
    <ScrollView className="flex-1 bg-orange-100" showsVerticalScrollIndicator={false}>
      <MainHeader>
        <TouchableOpacity activeOpacity={0.6} onPress={goBack}>
          <AppIcon name='chevron-left' size={27} className='text-gray-700 mt-[5]' />
        </TouchableOpacity>
      </MainHeader>
      <View className='flex-1 items-center justify-center'>
        <View className='w-[95%] h-full pb-[40] self-center mt-[100] items-center justify-center'>
          <Text className='text-3xl text-gray-800 font-bold mb-[40]'>Sign Up to Continue!</Text>
          <TextInput
            className='h-[50] text-black-600 w-[95%] font-[500] border-b border-gray-500 p-2 text-start'
            placeholderTextColor={'#444444'}
            placeholder='Email'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className='h-[50] text-black-600 w-[95%] font-[500] border-b border-gray-500 p-2 mb-[30] text-start'
            placeholderTextColor={'#444444'}
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            value={password}
            onChangeText={setPassword}
          />
          <MainButton style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] self-center my-[15] bg-orange-400 border border-gray-400 rounded-lg' textClassName='text-xl text-gray-900' onPress={SignUpHandler}>
            Sign Up
          </MainButton>
          <View className='w-[95%] self-center items-center justify-between flex-row my-[10]'>
            <View className='w-[45%] h-[1] bg-gray-400' />
            <Text className='w-[10%] font-bold text-gray-700 text-center'>Or</Text>
            <View className='w-[45%] h-[1] bg-gray-400' />
          </View>
          <MainButton style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] self-center my-[15] bg-[#e55039] border border-gray-400 rounded-lg' textClassName='text-xl text-white' icon={{ name: 'google-plus', className: 'text-white me-3' }} onPress={SignUpWithGoogle}>
            Continue with Google
          </MainButton>
          <Text className='text-l text-orange-400 mt-[20]' onPress={() => navigation.popTo('Login')}>Have an account? <Text className='text-l text-gray-700 font-bold'>Login</Text></Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default SignUpScreen;