import React, { useState, JSX, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import { ERROR_CODES } from '../../../constants/AWS/auth/ErrorCodes';
import { getErrorMessage } from '../../../utils';
import { APP_THEME } from '../../../theme/styles';
import Spinner from '../../../components/Spinner';
import { AuthContext } from '../../../context/Auth';


const LoginScreen = ({ navigation }: any): JSX.Element => {

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
        Alert.alert('', 'Logged in successfully', [
          {
            text: 'Ok, thanks'
          }
        ]);
        const userSession = await fetchAuthSession();
        await login(userSession.credentials?.sessionToken, results.isSignedIn);
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
    console.log('Login with Google Auth');
  }

  if (loading) return <Spinner />

  return (
    <ScrollView className="flex-1 bg-orange-100" showsVerticalScrollIndicator={false}>
      <View className='flex-1 items-center justify-center'>
        <View className='w-[95%] h-full pb-[40] self-center mt-[100] items-center justify-center'>
          <Text className='text-3xl text-gray-800 font-bold mb-[40]'>Welcome Back!</Text>
          <TextInput
            className='h-[50] text-black-600 w-[95%] font-[500] border-b border-gray-500 p-2 text-start'
            placeholderTextColor={'#444444'}
            placeholder='Email'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className='h-[50] text-black-600 w-[95%] font-[500] border-b border-gray-500 p-2 mb-[20] text-start'
            placeholderTextColor={'#444444'}
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity activeOpacity={0.6} style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] h-[50] self-center items-center justify-center my-[15] bg-orange-400 border border-gray-400 rounded-lg' onPress={loginHandler}>
            <Text className='text-xl text-black-600 font-[500]'>Login</Text>
          </TouchableOpacity>
          <View className='w-[95%] self-center items-center justify-between flex-row my-[10]'>
            <View className='w-[45%] h-[1] bg-gray-400' />
            <Text className='w-[10%] font-bold text-gray-700 text-center'>Or</Text>
            <View className='w-[45%] h-[1] bg-gray-400' />
          </View>
          <TouchableOpacity activeOpacity={0.6} style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] h-[50] self-center items-center justify-center my-[15] bg-white border border-gray-400 rounded-lg' onPress={loginWithGoogle}>
            <Text className='text-xl text-black-600 font-[500]'>Continue with Google</Text>
          </TouchableOpacity>
          <Text className='text-l text-orange-400 mt-[20]' onPress={() => navigation.navigate('SignUp')}>Don't have an account? <Text className='text-l text-gray-700 font-bold'>Sign Up</Text></Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default LoginScreen;