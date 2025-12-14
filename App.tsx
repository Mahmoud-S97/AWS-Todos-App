import './src/global.css'
import './src/awsConfig';
import React, { JSX } from 'react';
import { StatusBar, View } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import { AppThemeProvider, useAppTheme } from './src/context/AppTheme';
import { AuthProvider } from './src/context/Auth';

const AppContent = (): JSX.Element => {

  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <View className={isDark ? 'dark flex-1' : 'flex-1'}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={false}
      />
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