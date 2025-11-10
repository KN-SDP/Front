import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './Login';
import SignUp from './SignUp';
import FindId from './FindId';
import FindPw from './FindPw';
import Home from './Home';
import Motivation from './Motivation';
import AddMotivation from './AddMotivation';
import ResetPw from './ResetPw';
import MyPage from './MyPage';
import History from './History';
import HistoryDetail from './HistoryDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('loading');

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setInitialRoute(token ? 'Home' : 'Login');
    };

    checkLogin();
  }, []);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(Ionicons.font);
    }
    loadFonts();
  }, []);

  // 로딩 동안 null 렌더
  if (initialRoute === 'loading') return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute} // 토큰 기반으로 결정
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="FindId" component={FindId} />
        <Stack.Screen name="FindPw" component={FindPw} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Motivation" component={Motivation} />
        <Stack.Screen name="AddMotivation" component={AddMotivation} />
        <Stack.Screen name="ResetPw" component={ResetPw} />
        <Stack.Screen name="MyPage" component={MyPage} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="HistoryDetail" component={HistoryDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
