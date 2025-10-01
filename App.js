// App.js
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

// 선택: 테마/Provider 생략하고 최소 구성으로 안정화부터
import Login from './Login';
import SignUp from './SignUp';
import FindId from './FindId';

// 웹은 기본 Stack, 네이티브는 Native Stack
const Stack = Platform.OS === 'web'
  ? createStackNavigator()
  : createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: Platform.OS === 'web', // 필요시 헤더 on/off
        }}
      >
        <Stack.Screen name="Login" component={Login} options={{ title: '' }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: '' }} />
        <Stack.Screen name="FindId" component={FindId} options={{ title: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
