import './src/global.css'
import './src/awsConfig';
import React, { JSX } from 'react';
import { View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { AppThemeProvider, useAppTheme } from './src/context/AppTheme';
import { AuthProvider } from './src/context/Auth';

const AppContent = (): JSX.Element => {

  const { appTheme } = useAppTheme();

  return (
    <View className={appTheme === 'dark' ? 'dark flex-1' : 'flex-1'}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </View>
  )
}

const App = (): JSX.Element => {

  return (
    <AppThemeProvider>
      <AppContent />
    </AppThemeProvider>
  )
}

export default App;