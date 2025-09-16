/*
모킹용 getProfile() 사용
API 연동시 : 
  - AsyncStorage 등에서 JWT 토큰 읽고 axois 요청
  - 서버에서 유저 정보 받아 rendering
  - 로그아웃 시 토큰 삭제
*/

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from './AuthService'; // 모킹 유저 정보

export default function Home({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 모킹 유저 정보 가져오기
    const fetchProfile = async () => {
      const profile = await getProfile();
      setUser(profile);
    };
    fetchProfile();
  }, []);

  const logout = async () => {
    // 단순 화면 이동
    await AsyncStorage.removeItem('token'); // 나중에 토큰 저장한다고 가정
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {user ? `${user.name}님 환영합니다!` : '로딩중...'}
      </Text>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
  logoutButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  logoutText: { color: '#fff', fontSize: 16 },
});
