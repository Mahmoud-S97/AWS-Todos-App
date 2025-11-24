import React, { useState, JSX } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { signUp } from 'aws-amplify/auth';
import { getErrorMessage } from '../../../utils';
import { ERROR_CODES } from '../../../constants/AWS/auth/ErrorCodes';
import { APP_THEME } from '../../../theme/styles';
import Spinner from '../../../components/Spinner';

const SignUpScreen = ({ navigation }: any): JSX.Element => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


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

  if(loading) return <Spinner />

  return (
    <ScrollView style={{ flex: 1, backgroundColor: APP_THEME.backgroundColor }} showsVerticalScrollIndicator={false}>
      <View style={styles.screen}>
        <View style={styles.container}>
          <TextInput
            style={styles.textInputStyle}
            placeholderTextColor={'#444444'}
            placeholder='Email'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.textInputStyle}
            placeholderTextColor={'#444444'}
            placeholder='Password'
            secureTextEntry
            autoCapitalize='none'
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={[styles.signUpBtns, { marginTop: 40 }]} onPress={SignUpHandler}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
          <Text>_______ Or ______</Text>
          <TouchableOpacity style={styles.signUpBtns} onPress={SignUpWithGoogle}>
            <Text>Continue with Google</Text>
          </TouchableOpacity>
          <Text style={styles.signInAskText} onPress={() => navigation.popTo('Login')}>Have an account? <Text style={styles.signInText}>Login</Text></Text>
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
  signUpBtns: {
    width: '95%',
    alignSelf: 'center',
    height: 50,
    backgroundColor: 'orange',
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInAskText: {
    color: 'orange',
    fontSize: 15,
    marginTop: 20
  },
  signInText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16
  }
});

export default SignUpScreen;