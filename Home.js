// Home.js
// 로그인 성공 후 이동하는 홈 화면
// 👉 getProfile() 호출해 사용자 정보 표시

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getProfile } from './AuthService';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getProfile();
      setUser(profile);
    };
    loadProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>홈 화면</Text>
      {user ? (
        <Text>{user.name}님, 환영합니다!</Text>
      ) : (
        <Text>사용자 정보를 불러오는 중...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
