import React, { useState, JSX } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { confirmSignUp } from 'aws-amplify/auth';
import { getErrorMessage } from '../../../utils';
import { APP_THEME } from '../../../theme/styles';
import Spinner from '../../../components/Spinner';

const SignUpVerification = (props: any): JSX.Element => {

  const username = props.route.params.userName;
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
          onPress: () => props.navigation.replace('Login')
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

    <ScrollView style={{ flex: 1, backgroundColor: APP_THEME.backgroundColor }} showsVerticalScrollIndicator={false}>
      <View style={styles.screen}>
        <View style={styles.container}>
          <TextInput
            style={styles.textInputStyle}
            placeholderTextColor={'#444444'}
            placeholder='Verify code from 6 digits'
            value={verificationCode}
            onChangeText={setVerificationCode}
          />
          <TouchableOpacity style={[styles.loginBtns, { marginTop: 40 }]} onPress={verifySignUpCode}>
            <Text>Confirm Code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingBottom: 40
  },
  textInputStyle: {
    width: '95%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    alignSelf: 'center',
    padding: 8
  },
  placeholderStyles: {
    color: '#444444'
  },
  loginBtns: {
    width: '95%',
    alignSelf: 'center',
    height: 50,
    backgroundColor: 'orange',
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SignUpVerification;