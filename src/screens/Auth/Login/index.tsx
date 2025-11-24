import React, { useState, JSX } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import { ERROR_CODES } from '../../../constants/AWS/auth/ErrorCodes';
import { getErrorMessage, saveDataToAsyncStorage } from '../../../utils';
import { LOCAL_STORAGE_KEYS } from '../../../constants/AWS/auth/localStorageKeys';
import { APP_THEME } from '../../../theme/styles';
import Spinner from '../../../components/Spinner';

const LoginScreen = ({ navigation }: any): JSX.Element => {

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
        await saveDataToAsyncStorage(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, userSession.credentials?.sessionToken?.toString());
        await saveDataToAsyncStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN, results.isSignedIn.toString());
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
          <TouchableOpacity style={[styles.loginBtns, { marginTop: 40 }]} onPress={loginHandler}>
            <Text>Login</Text>
          </TouchableOpacity>
          <Text>_______ Or ______</Text>
          <TouchableOpacity style={styles.loginBtns} onPress={loginWithGoogle}>
            <Text>Continue with Google</Text>
          </TouchableOpacity>
          <Text style={styles.signUpAskText} onPress={() => navigation.navigate('SignUp')}>Don't have an account? <Text style={styles.signUpText}>Sign Up</Text></Text>
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
  },
  signUpAskText: {
    color: 'orange',
    fontSize: 15,
    marginTop: 20
  },
  signUpText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16
  }
});

export default LoginScreen;