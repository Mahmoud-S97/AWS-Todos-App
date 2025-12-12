import React, { useState, JSX, useContext } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signIn, fetchAuthSession, signInWithRedirect, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { ERROR_CODES } from '../../../constants/AWS/auth/ErrorCodes';
import { getErrorMessage } from '../../../utils';
import { APP_THEME } from '../../../theme/styles';
import Spinner from '../../../components/Spinner';
import { AuthContext } from '../../../context/Auth';
import MainButton from '../../../components/Global/MainButton';
import { RootStackParamList } from '../../../navigation/types';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>

const LoginScreen = ({ navigation }: Props): JSX.Element => {

  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const loginHandler = async () => {
    try {
      setLoading(true);
      const results = await signIn({
        username: email,
        password
      });
      if (results.isSignedIn) {

        const userSession = await fetchAuthSession();
        const currentUser = await getCurrentUser();
        const userProfile = {
          id: currentUser.userId,
          sub: currentUser.userId,
          username: currentUser.signInDetails?.loginId?.split('@')[0],
          email: currentUser.signInDetails?.loginId,
          picture: `https://api.dicebear.com/7.x/thumbs/png?seed=${currentUser.signInDetails?.loginId}`
        }
        await login(userSession.credentials?.sessionToken, results.isSignedIn, userProfile);

        Alert.alert('', 'Logged in successfully', [
          {
            text: 'Ok, thanks'
          }
        ]);
      }
    } catch (error: any) {
      getErrorMessage(error);
      if (error.name === ERROR_CODES.UserNotConfirmedException) {
        navigation.navigate('SignUpVerification', { userName: email });
      }
      if (error.name === ERROR_CODES.UserNotFoundException) {
        navigation.navigate('SignUp');
      }
    } finally {
      setLoading(false);
    }
  }

  const loginWithGoogle = async () => {
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
    <ScrollView className="flex-1 bg-primary-light dark:bg-primary-dark" showsVerticalScrollIndicator={false}>
      <View className='flex-1 items-center justify-center'>
        <View className='w-[95%] h-full pb-[40] self-center mt-[100] items-center justify-center'>
          <Text className='text-3xl text-text-dark dark:text-text-light font-bold mb-[40]'>Welcome Back!</Text>
          <TextInput
            className='h-[50] text-text-dark dark:text-text-light placeholder:text-text-dark placeholder:dark:text-text-light w-[95%] font-[500] border-b border-gray-500 dark:border-gray-700 p-2 text-start'
            placeholder='Email'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className='h-[50] text-text-dark dark:text-text-light placeholder:text-text-dark placeholder:dark:text-text-light w-[95%] font-[500] border-b border-gray-500 dark:border-gray-700 p-2 mb-[30] text-start'
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            value={password}
            onChangeText={setPassword}
          />
          <MainButton style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] self-center my-[15] bg-primary-default border border-gray-400 dark:border-gray-700 rounded-lg' textClassName='text-xl text-gray-900' onPress={loginHandler}>
            Login
          </MainButton>
          <View className='w-[95%] self-center items-center justify-between flex-row my-[10]'>
            <View className='w-[45%] h-[1] bg-gray-400 dark:bg-gray-500' />
            <Text className='w-[10%] font-bold text-text-dark dark:text-text-light text-center'>Or</Text>
            <View className='w-[45%] h-[1] bg-gray-400 dark:bg-gray-500' />
          </View>
          <MainButton style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] self-center my-[15] bg-background-googleButton border border-gray-400 dark:border-gray-700 rounded-lg' textClassName='text-xl text-white' icon={{ name: 'google-plus', className: 'text-white me-3' }} onPress={loginWithGoogle}>
            Continue with Google
          </MainButton>
          <Text className='text-l text-text-dark dark:text-text-light mt-[20]' onPress={() => navigation.navigate('SignUp')}>Don't have an account? <Text className='text-l text-primary-default font-bold'>Sign Up</Text></Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default LoginScreen; 