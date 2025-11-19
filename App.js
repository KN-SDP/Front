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

export default function App() {
  const [initialRoute, setInitialRoute] = useState('loading');
  const [fontsReady, setFontsReady] = useState(false);

  // --------------------------------------
  // 🔥 소셜 로그인 콜백 URL 파싱 함수
  // --------------------------------------
  const handleSocialCallback = async (url) => {
    if (!url) return;

    const { queryParams } = Linking.parse(url);
    if (!queryParams) return;

    const { token, isNewUser, email, username, nickname } = queryParams;

    console.log('소셜 로그인 콜백:', queryParams);

    if (!token) return;

    if (isNewUser === 'true') {
      navigationRef?.navigate('SignUp', {
        socialEmail: email,
        socialName: username,
        socialNickname: nickname,
      });
    } else {
      await AsyncStorage.setItem('accessToken', token);
      navigationRef?.navigate('Home');
    }
  };

  // --------------------------------------
  // 🔥 Linking 이벤트 리스너 등록
  // --------------------------------------
  useEffect(() => {
    // 앱 시작 시 URL 확인
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('oauth-redirect')) {
        handleSocialCallback(url);
      }
    });

    // 앱이 열린 상태에서 URL 들어올 때
    const sub = Linking.addEventListener('url', (event) => {
      if (event.url && event.url.includes('oauth-redirect')) {
        handleSocialCallback(event.url);
      }
    });

    return () => sub.remove();
  }, []);
  // -------------------------------------------------------
  // 2️⃣ 웹 전용 redirect 파싱 (★ 여기 넣는 것이 정답)
  // -------------------------------------------------------
  useEffect(() => {
    if (Platform.OS === 'web') {
      const params = new URLSearchParams(window.location.search);

      const token = params.get('token');
      const isNewUser = params.get('isNewUser');
      const email = params.get('email');
      const username = params.get('username'); // ✔ 수정됨
      const nickname = params.get('nickname');

      if (token && isNewUser) {
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
      }
    }
  }, []);

  // --------------------------------------
  // 1) 자동 로그인 체크
  // --------------------------------------
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setInitialRoute(token ? 'Home' : 'Login');
    };
    checkLogin();
  }, []);

  // --------------------------------------
  // 2) 폰트 로딩
  // --------------------------------------
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
    <NavigationContainer
      ref={(ref) => (navigationRef = ref)} // 🔥 navigationRef 추가
    >
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
