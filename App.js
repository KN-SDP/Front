import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Linking } from 'react-native';
import { jwtDecode } from 'jwt-decode';

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
import Management from './Management';
import ChangeNick from './ChangeNick';
import Settings from './Settings';
import SetAlarm from './SetAlarm';
import Secession from './Secession';
const Stack = createNativeStackNavigator();

export default function App() {
  // ⭐ useRef로 navigationRef 선언
  const navigationRef = useRef(null);

  const [initialRoute, setInitialRoute] = useState(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [oAuthReady, setOAuthReady] = useState(false);
  const [pendingOAuth, setPendingOAuth] = useState(null);

  /* --------------------------------------------
     🔥 1) 웹 OAuth 파싱
  ---------------------------------------------*/
  useEffect(() => {
    if (Platform.OS !== 'web') {
      setOAuthReady(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const isNewUser = params.get('isNewUser');

    if (token) {
      console.log('웹 OAuth 감지됨:', token);
      const decoded = jwtDecode(token);

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
    }

    setOAuthReady(true);
  }, []);

  /* --------------------------------------------
     🔥 2) navigationRef 준비되면 OAuth 처리
  ---------------------------------------------*/
  useEffect(() => {
    if (!pendingOAuth) return;
    if (!navigationRef.current) return;

    console.log('▶ OAuth 처리 시작:', pendingOAuth);

    if (pendingOAuth.type === 'signup') {
      navigationRef.current.navigate('SignUp', {
        socialEmail: pendingOAuth.email,
        socialName: pendingOAuth.username,
        socialNickname: pendingOAuth.nickname,
      });
    } else {
      AsyncStorage.setItem('accessToken', pendingOAuth.token);
      navigationRef.current.navigate('Home');
    }

    setPendingOAuth(null);
  }, [pendingOAuth]);

  /* --------------------------------------------
     🔥 3) 자동 로그인
  ---------------------------------------------*/
  useEffect(() => {
    if (!oAuthReady) return;

    const check = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setInitialRoute(token ? 'Home' : 'Login');
    };

    check();
  }, [oAuthReady]);

  /* --------------------------------------------
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

  if (!oAuthReady || !fontsReady) return null;

  return (
    // ⭐ ref는 무조건 이렇게!
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute ?? 'Login'}
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
        <Stack.Screen name="Management" component={Management} />
        <Stack.Screen name="ChangeNick" component={ChangeNick} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="SetAlarm" component={SetAlarm} />
        <Stack.Screen name="Secession" component={Secession} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
