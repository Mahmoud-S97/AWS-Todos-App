import React, { useState, JSX } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { signUp } from 'aws-amplify/auth';
import { getErrorMessage } from '../../../utils';
import { ERROR_CODES } from '../../../constants/AWS/auth/ErrorCodes';
import { APP_THEME } from '../../../theme/styles';
import Spinner from '../../../components/Spinner';
import MainHeader from '../../../components/Global/MainHeader';
import AppIcon from '../../../components/Global/AppIcon';

const SignUpScreen = ({ navigation }: any): JSX.Element => {

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
    console.log('SignUp with Google Auth');
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
          <Text className='text-3xl text-gray-800 font-bold mb-[40]'>Sign Up to Continue</Text>
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
          <TouchableOpacity activeOpacity={0.6} style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] h-[50] self-center items-center justify-center my-[15] bg-orange-400 border border-gray-400 rounded-lg' onPress={SignUpHandler}>
            <Text className='text-xl text-black-600 font-[500]'>Sign Up</Text>
          </TouchableOpacity>
          <View className='w-[95%] self-center items-center justify-between flex-row my-[10]'>
            <View className='w-[45%] h-[1] bg-gray-400' />
            <Text className='w-[10%] font-bold text-gray-700 text-center'>Or</Text>
            <View className='w-[45%] h-[1] bg-gray-400' />
          </View>
          <TouchableOpacity activeOpacity={0.6} style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] h-[50] self-center items-center justify-center my-[15] bg-white border border-gray-400 rounded-lg' onPress={SignUpWithGoogle}>
            <Text className='text-xl text-black-600 font-[500]'>Continue with Google</Text>
          </TouchableOpacity>
          <Text className='text-l text-orange-400 mt-[20]' onPress={() => navigation.popTo('Login')}>Have an account? <Text className='text-l text-gray-700 font-bold'>Login</Text></Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default SignUpScreen;