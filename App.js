// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Restyle
import { ThemeProvider, createTheme } from '@shopify/restyle';

import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';

const Stack = createNativeStackNavigator();

// ✅ 간단 테마 (필요시 여기서만 수정)
// - 새 파일 만들지 않고 App.js 내부에 테마 정의
const theme = createTheme({
  colors: {
    background: '#FFFFFF',
    text: '#111111',
    muted: '#666666',
    primary: '#111111',
    primaryDisabled: '#999999',
    danger: '#DC143C',
    border: '#DDDDDD',
  },
  spacing: {
    0: 0,
    xs: 6,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    '2xl': 24,
  },
  radii: {
    s: 8,
    m: 10,
    l: 14,
  },
  textVariants: {
    defaults: { color: 'text', fontSize: 16 },
    title: { color: 'text', fontSize: 24, fontWeight: '700' },
    button: { color: 'background', fontSize: 16, fontWeight: '600' },
    hint: { color: 'muted', fontSize: 14 },
    error: { color: 'danger', fontSize: 14 },
  },
});

const linking = {
  // 웹 URL ↔ 라우트 동기화 (라이트 플랜)
  prefixes: [typeof window !== 'undefined' && window.location ? window.location.origin : 'myapp://'],
  config: {
    screens: {
      Home: 'home',
      Login: 'login',
      SignUp: 'sign-up',
    },
  },
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerTitleAlign: 'center' }}
        >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: '홈', headerBackVisible: false }}
          />
          <Stack.Screen
name="Login"
component={Login}
options={{ headerTitle: '', headerShadowVisible: false }}
/>
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerTitle: '', headerShadowVisible: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
