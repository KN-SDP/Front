// App.js
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
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
import LoginResetPw from './LoginResetPw';
import EditMotivation from './EditMotivation';
import MotivationDetail from './MotivationDetail';
import Assets from './Assets';
import AddAssets from './AddAssets';
import HistoryCheck from './HistoryCheck';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['https://knusdpsl.mooo.com', 'http://localhost:19006'],
  config: {
    screens: {
      Login: 'oauth-redirect',
      SignUp: 'signup',
      Home: 'home',
    },
  },
};

export default function App() {
  const navigationRef = useRef(null);

  const [initialRoute, setInitialRoute] = useState(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [oAuthReady, setOAuthReady] = useState(false);

  const [pendingOAuth, setPendingOAuth] = useState(null);
  const [pendingRegister, setPendingRegister] = useState(null);
  // ---------------------------------------
  useEffect(() => {
    if (Platform.OS !== 'web') {
      setOAuthReady(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const isNewUser = params.get('isNewUser');
    const registerToken = params.get('registerToken');

    console.log('📌 Raw Redirect URL:', window.location.href);
    console.log('📌 token =', token);
    console.log('📌 isNewUser =', isNewUser);
    console.log('📌 registerToken =', registerToken);

    // 기존 유저 → token 존재
    if (token && isNewUser === 'false') {
      setPendingOAuth({ type: 'login', token });
    }

    // 신규 유저 → registerToken 존재
    if (registerToken) {
      const decoded = jwtDecode(registerToken);
      setPendingRegister({
        email: decoded.email,
        username: decoded.name,
        nickname: decoded.providerId,
      });
    }

    setOAuthReady(true);
  }, []);

  // ---------------------------------------
  useEffect(() => {
    if (!pendingOAuth) return;
    if (!navigationRef.current) return;

    AsyncStorage.setItem('accessToken', pendingOAuth.token);
    navigationRef.current.navigate('Home');

    // URL 깔끔하게 정리
    if (Platform.OS === 'web') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    setPendingOAuth(null);
  }, [pendingOAuth]);

  // ---------------------------------------
  useEffect(() => {
    if (!pendingRegister) return;
    if (!navigationRef.current) return;

    navigationRef.current.navigate('SignUp', {
      socialEmail: pendingRegister.email,
      socialName: pendingRegister.username,
      socialNickname: pendingRegister.nickname,
    });

    // URL 초기화
    if (Platform.OS === 'web') {
      window.history.replaceState(null, '', window.location.pathname);
    }

    setPendingRegister(null);
  }, [pendingRegister]);

  // -----------------------------------------------------
  // 🔥 4) 자동 로그인
  // -----------------------------------------------------
  useEffect(() => {
    if (!oAuthReady) return;

    const check = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setInitialRoute(token ? 'Home' : 'Login');
    };

    check();
  }, [oAuthReady]);

  // -----------------------------------------------------
  // 🔥 5) 폰트 로딩
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // 🔥 6) 네비게이션 렌더링 (linking 적용)
  // -----------------------------------------------------
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
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
        <Stack.Screen name="LoginResetPw" component={LoginResetPw} />
        <Stack.Screen name="EditMotivation" component={EditMotivation} />
        <Stack.Screen name="MotivationDetail" component={MotivationDetail} />
        <Stack.Screen name="Assets" component={Assets} />
        <Stack.Screen name="AddAssets" component={AddAssets} />
        <Stack.Screen name="HistoryCheck" component={HistoryCheck} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
