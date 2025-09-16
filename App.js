/*
현재 : 프론트 모킹용으로 Navigation만 setting
API연동 시 :
  - 로그인 성공 여부에 따라 Home 화면으로 이동
*/

// 앱 진입점, React Navigation 스택 네이게이터 설정
// Expo 환경 기준
import 'react-native-gesture-handler'; // 반드시 최상단에 위치
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';

const Stack = createStackNavigator();

export default function App() {
  return (
    // 네비게이션 상태 관리
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
