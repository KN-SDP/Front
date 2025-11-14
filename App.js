import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, TextInput } from 'react-native';

// ====== 페이지들 ======
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
  const [fontsReady, setFontsReady] = useState(false);

  // ------ 1) 자동 로그인 체크 ------
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setInitialRoute(token ? 'Home' : 'Login');
    };
    checkLogin();
  }, []);

  // ------ 2) Pretendard + Ionicons 폰트 로딩 ------
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...Ionicons.font,
        Pretendard: require('./assets/fonts/Pretendard-Regular.ttf'),
        PretendardBold: require('./assets/fonts/Pretendard-Bold.ttf'),
        PretendardMedium: require('./assets/fonts/Pretendard-Medium.ttf'),
        PretendardSemiBold: require('./assets/fonts/Pretendard-SemiBold.ttf'),
      });

      setFontsReady(true);
    }

    loadFonts();
  }, []);

  // ------ 3) 폰트 또는 초기 라우트 준비 안되면 렌더 X ------
  if (initialRoute === 'loading' || !fontsReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
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
