import React, { useState, JSX } from 'react';
import { View, Text, TextInput, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { confirmSignUp } from 'aws-amplify/auth';
import { getErrorMessage } from '../../../utils';
import { APP_THEME } from '../../../theme/styles';
import Spinner from '../../../components/Spinner';
import MainButton from '../../../components/Global/MainButton';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUpVerification'>

const SignUpVerification = (props: Props): JSX.Element => {

  const username = props.route.params?.userName;
  const [verificationCode, setVerificationCode] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verifySignUpCode = async () => {
    try {
      setLoading(true);
      await confirmSignUp({
        username, // email in our case!
        confirmationCode: verificationCode
      });

      Alert.alert('', 'Account has been verified!', [
        {
          text: 'Login to continue',
          onPress: () => props.navigation.popTo('Login')
        }
      ]);
    } catch (error: any) {
      getErrorMessage(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Spinner />

  return (

    <ScrollView className="flex-1 bg-orange-100" showsVerticalScrollIndicator={false}>
      <View className='flex-1 items-center justify-center'>
        <View className='w-[95%] h-full pb-[40] self-center mt-[100] items-center justify-center'>
          <Text className='text-3xl text-gray-800 font-bold mb-[40]'>Code Verification</Text>
          <TextInput
            className='h-[50] text-black-600 w-[95%] font-[500] border-b border-gray-500 p-2 mb-[30] text-start'
            placeholderTextColor={'#444444'}
            placeholder='Verify code from 6 digits'
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <MainButton style={[APP_THEME.mainShadow, { borderWidth: 1 }]} className='w-[96%] self-center my-[15] bg-orange-400 border border-gray-400 rounded-lg' textClassName='text-xl text-gray-900' onPress={verifySignUpCode}>
            Confirm Code
          </MainButton>
        </View>
      </View>
    </ScrollView>
  )
}

export default SignUpVerification;