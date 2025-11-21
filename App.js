export let navigationRef = null;

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Linking } from 'react-native';

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
import FindIdResult from './FindIdResult';

const Stack = createNativeStackNavigator();

/* ----------------------------------------------------------
   🔥 1) 소셜 콜백 처리 함수 (모바일/웹 공용)
-----------------------------------------------------------*/
const handleSocialCallback = async (params) => {
  if (!params) return;

  const token = params.token;
  const isNewUser = params.isNewUser;
  const email = params.email ?? '';
  const username = params.username ?? '';
  const nickname = params.nickname ?? '';

  console.log('✔ 소셜 로그인 파라미터:', params);

  if (!token) return;

  if (isNewUser === 'true') {
    // 신규 유저 → 회원가입 자동 기입
    navigationRef?.navigate('SignUp', {
      socialEmail: email,
      socialName: username,
      socialNickname: nickname,
    });
  } else {
    // 기존 유저 → 액세스 토큰 저장 후 홈 이동
    await AsyncStorage.setItem('accessToken', token);
    navigationRef?.navigate('Home');
  }
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState('loading');
  const [fontsReady, setFontsReady] = useState(false);

  /* ----------------------------------------------------------
     🔥 2) 모바일 Linking 처리
  -----------------------------------------------------------*/
  useEffect(() => {
    if (Platform.OS === 'web') return; // 웹에서는 패스

    // 앱이 처음 열렸을 때
    Linking.getInitialURL().then((url) => {
      if (!url) return;
      if (!url.includes('oauth-redirect')) return;

      const parsed = Linking.parse(url);
      handleSocialCallback(parsed.queryParams);
    });

    // 앱이 열린 상태에서 URL 들어올 때
    const sub = Linking.addEventListener('url', (event) => {
      if (!event.url) return;
      if (!event.url.includes('oauth-redirect')) return;

      const parsed = Linking.parse(event.url);
      handleSocialCallback(parsed.queryParams);
    });

    return () => sub.remove();
  }, []);

  /* ----------------------------------------------------------
     🔥 3) 웹 전용 URL 파싱 처리
  -----------------------------------------------------------*/
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const params = new URLSearchParams(window.location.search);

    const token = params.get('token');
    const isNewUser = params.get('isNewUser');
    const email = params.get('email');
    const username = params.get('username');
    const nickname = params.get('nickname');

    if (!token) return;

    if (isNewUser === 'true') {
      navigationRef?.navigate('SignUp', {
        socialEmail: email,
        socialName: username,
        socialNickname: nickname,
      });
    } else {
      AsyncStorage.setItem('accessToken', token);
      navigationRef?.navigate('Home');
    }
  }, []);

  /* ----------------------------------------------------------
     🔥 4) 자동 로그인 체크
  -----------------------------------------------------------*/
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setInitialRoute(token ? 'Home' : 'Login');
    };
    checkLogin();
  }, []);

  /* ----------------------------------------------------------
     🔥 5) 폰트 로딩
  -----------------------------------------------------------*/
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

  if (initialRoute === 'loading' || !fontsReady) return null;

  return (
    <NavigationContainer ref={(ref) => (navigationRef = ref)}>
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
        <Stack.Screen name="FindIdResult" component={FindIdResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
