// Home.js
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import AuthService from './AuthService';

export default function Home({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await AuthService.getCurrentUser();
        if (!mounted) return;
        setUser(u);
        setShowWelcome(!!u);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 상단 타이틀 */}
      <View
        style={{
          paddingVertical: 16,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#000',
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '800' }}>Smart Ledger</Text>
      </View>

      {/* 메인 박스 */}
      <View
        style={{
          backgroundColor: '#C4C4C4',
          paddingVertical: 40,
          paddingHorizontal: 24,
          marginHorizontal: 16,
          marginTop: 20,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
          스마트한 자동화
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>소비내역 관리</Text>
      </View>

      {/* 안내 문구 */}
      <View
        style={{
          backgroundColor: '#E5E5EA',
          alignSelf: 'center',
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 16,
          marginTop: 30,
        }}
      >
        <Text style={{ fontSize: 14, color: '#333', textAlign: 'center' }}>
          로그인 하시면 기능을 확인하실 수 있어요.
        </Text>
      </View>

      {/* 로그인 버튼 */}
      <Pressable
        onPress={() => navigation.replace('Login')}
        style={{
          backgroundColor: '#C4C4C4',
          alignSelf: 'center',
          marginTop: 16,
          paddingHorizontal: 40,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>
          로그인
        </Text>
      </Pressable>

      {/* TODO: 하단 탭바 유지 */}
    </View>
  );
}
