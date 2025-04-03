import React from 'react';
import MainStack from './src/navigation/Main.stack.tsx';
import {NavigationContainer} from '@react-navigation/native';
import {theme} from './src/theme/index.ts';
import {ThemeProvider} from '@rneui/themed';

function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
