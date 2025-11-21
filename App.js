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

  // ⭐ navigate를 즉시 하지 않고 여기 저장함
  const [pendingOAuth, setPendingOAuth] = useState(null);

  /* ----------------------------------------------------------
     1) 웹 OAuth 파싱 (NavigationContainer 렌더 전에 실행됨)
  -----------------------------------------------------------*/
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const isNewUser = params.get('isNewUser');

    if (!token) return;

    const decoded = jwtDecode(token);
    console.log('🔥 디코딩 결과:', decoded);

    if (isNewUser === 'true') {
      setPendingOAuth({
        type: 'signup',
        email: decoded.email,
        username: decoded.username,
        nickname: decoded.nickname,
      });
    } else {
      setPendingOAuth({
        type: 'login',
        token,
      });
    }
  }, []);

  /* ----------------------------------------------------------
     2) NavigationContainer 생성 후 pendingOAuth 실행
  -----------------------------------------------------------*/
  useEffect(() => {
    if (!pendingOAuth || !navigationRef) return;

    if (pendingOAuth.type === 'signup') {
      navigationRef.navigate('SignUp', {
        socialEmail: pendingOAuth.email,
        socialName: pendingOAuth.username,
        socialNickname: pendingOAuth.nickname,
      });
    } else {
      AsyncStorage.setItem('accessToken', pendingOAuth.token);
      navigationRef.navigate('Home');
    }

    setPendingOAuth(null); // 한 번 실행 후 제거
  }, [pendingOAuth, navigationRef]);

  /* ----------------------------------------------------------
     3) 모바일 OAuth 처리
  -----------------------------------------------------------*/
  useEffect(() => {
    if (Platform.OS === 'web') return;

    Linking.getInitialURL().then((url) => {
      if (!url || !url.includes('oauth-redirect')) return;

      const parsed = Linking.parse(url);
      handleMobileOAuth(parsed.queryParams);
    });

    const sub = Linking.addEventListener('url', (event) => {
      if (!event.url || !event.url.includes('oauth-redirect')) return;

      const parsed = Linking.parse(event.url);
      handleMobileOAuth(parsed.queryParams);
    });

    return () => sub.remove();
  }, []);

  const handleMobileOAuth = async (params) => {
    const token = params.token;
    const isNewUser = params.isNewUser;

    if (!token) return;

    if (isNewUser === 'true') {
      navigationRef.navigate('SignUp', {
        socialEmail: params.email,
        socialName: params.username,
        socialNickname: params.nickname,
      });
    } else {
      AsyncStorage.setItem('accessToken', token);
      navigationRef.navigate('Home');
    }
  };

  /* ----------------------------------------------------------
     4) 자동 로그인 체크
  -----------------------------------------------------------*/
  useEffect(() => {
    async function checkLogin() {
      const token = await AsyncStorage.getItem('accessToken');
      setInitialRoute(token ? 'Home' : 'Login');
    }
    checkLogin();
  }, []);

  /* ----------------------------------------------------------
     5) 폰트 로딩
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

  if (!initialRoute || !fontsReady) return null;

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
