import './src/awsConfig';
import React, { JSX } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/Auth';

const App = (): JSX.Element => {

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  )
}

export default App;