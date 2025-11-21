export let navigationRef = null;

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Linking } from 'react-native';
import jwtDecode from 'jwt-decode';

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

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [oAuthChecked, setOAuthChecked] = useState(false);

  /* ----------------------------------------------------------
     🔥 1) 웹 OAuth 먼저 확인 (가장 우선)
  -----------------------------------------------------------*/
  useEffect(() => {
    async function processOAuth() {
      if (Platform.OS !== 'web') {
        setOAuthChecked(true);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const isNewUser = params.get('isNewUser');

      if (token) {
        console.log('🔥 웹 OAuth 감지됨:', { token, isNewUser });

        const decoded = jwtDecode(token);
        console.log('🔥 디코딩 결과:', decoded);

        const email = decoded.email;
        const username = decoded.username;
        const nickname = decoded.nickname;

        // 🎯 초기 라우트 방해하지 못하게 강제 초기화
        setInitialRoute('Login');

        // 🎯 즉시 네비게이션
        setTimeout(() => {
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
        }, 0);
      }

      setOAuthChecked(true);
    }

    processOAuth();
  }, []);
  /* ----------------------------------------------------------
     🔥 2) 모바일 OAuth 처리
  -----------------------------------------------------------*/
  useEffect(() => {
    if (Platform.OS === 'web') return;

    Linking.getInitialURL().then((url) => {
      if (!url) return;
      if (!url.includes('oauth-redirect')) return;

      const parsed = Linking.parse(url);
      const params = parsed.queryParams;

      if (!params.token) return;

      handleMobileOAuth(params);
    });

    const sub = Linking.addEventListener('url', (event) => {
      if (!event.url) return;
      if (!event.url.includes('oauth-redirect')) return;

      const parsed = Linking.parse(event.url);
      handleMobileOAuth(parsed.queryParams);
    });

    return () => sub.remove();
  }, []);

  const handleMobileOAuth = async (params) => {
    const token = params.token;
    const isNewUser = params.isNewUser;

    if (isNewUser === 'true') {
      navigationRef?.navigate('SignUp', {
        socialEmail: params.email,
        socialName: params.username,
        socialNickname: params.nickname,
      });
    } else {
      await AsyncStorage.setItem('accessToken', token);
      navigationRef?.navigate('Home');
    }
  };

  /* ----------------------------------------------------------
     🔥 3) 자동 로그인 체크 (OAuth 후에 실행)
  -----------------------------------------------------------*/
  useEffect(() => {
    async function loadLogin() {
      if (!oAuthChecked) return; // OAuth 먼저 확인할 때까지 대기

      const token = await AsyncStorage.getItem('accessToken');

      setInitialRoute(token ? 'Home' : 'Login');
    }

    loadLogin();
  }, [oAuthChecked]);

  /* ----------------------------------------------------------
     🔥 4) 폰트 로딩
  ---------------------------------------------*/
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

  /* ----------------------------------------------------------
     🔥 5) 준비 끝나기 전에는 렌더 안 함
  -----------------------------------------------------------*/
  if (!fontsReady || !oAuthChecked || !initialRoute) return null;

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
